import _ from "lodash";
import { identity } from "../utils/misc";
import Logger from "../utils/logger";
import { v4 as uuidV4 } from "uuid";
import { BASE_CONFIGURATION } from "../constants/base-configuration";
import * as db from "../init/db";

const CONFIG_UPDATE_INTERVAL = 10 * 60 * 1000; // 10 Minutes

type ConfigurationWithId = AddField<
  RollingTypes.Configuration,
  "configurationId",
  string
>;

function mergeConfigurations(
  baseConfiguration: RollingTypes.Configuration,
  liveConfiguration: Partial<RollingTypes.Configuration>,
): void {
  if (
    !_.isPlainObject(baseConfiguration) ||
    !_.isPlainObject(liveConfiguration)
  ) {
    return;
  }

  function merge(base: object, source: object): void {
    const commonKeys = _.intersection(_.keys(base), _.keys(source));

    commonKeys.forEach((key) => {
      const baseValue = base[key];
      const sourceValue = source[key];

      const isBaseValueObject = _.isPlainObject(baseValue);
      const isSourceValueObject = _.isPlainObject(sourceValue);

      if (isBaseValueObject && isSourceValueObject) {
        merge(baseValue, sourceValue);
      } else if (identity(baseValue) === identity(sourceValue)) {
        base[key] = sourceValue;
      }
    });
  }

  merge(baseConfiguration, liveConfiguration);
}

let configuration = BASE_CONFIGURATION;
let lastFetchTime = 0;
let serverConfigurationUpdated = false;

export async function getCachedConfiguration(
  attemptCacheUpdate = false,
): Promise<RollingTypes.Configuration> {
  if (
    attemptCacheUpdate &&
    lastFetchTime < Date.now() - CONFIG_UPDATE_INTERVAL
  ) {
    Logger.info("Cached configuration is stale.");
    return await getLiveConfiguration();
  }

  return configuration;
}

export async function getLiveConfiguration(): Promise<RollingTypes.Configuration> {
  lastFetchTime = Date.now();

  const configurationCollection = db.collection("configuration");

  try {
    const liveConfiguration = (await configurationCollection.get()).empty
      ? undefined
      : (await configurationCollection.get()).docs[0].data();

    if (liveConfiguration) {
      const baseConfiguration = _.cloneDeep(BASE_CONFIGURATION);

      const liveConfigurationWithoutId = _.omit(
        liveConfiguration,
        "configurationId",
      ) as RollingTypes.Configuration;
      mergeConfigurations(baseConfiguration, liveConfigurationWithoutId);

      pushConfiguration(baseConfiguration);
      configuration = baseConfiguration;
    } else {
      const configurationId = uuidV4();
      await configurationCollection.doc(configurationId).set({
        ...BASE_CONFIGURATION,
        configurationId,
      }); // Seed the base configuration.
    }
  } catch (error) {
    //console.error(`could not fetch configuration: Error:${error}`);
    Logger.logToDb(
      "fetch_configuration_failure",
      `Could not fetch configuration: ${error.message}`,
    );
  }

  return configuration;
}

async function pushConfiguration(
  configuration: RollingTypes.Configuration,
): Promise<void> {
  if (serverConfigurationUpdated) {
    return;
  }

  try {
    const oldConfiguration = (
      await db.collection("configuration").get()
    ).docs[0].data() as ConfigurationWithId;

    const configurationId = oldConfiguration.configurationId;
    await db
      .collection("configuration")
      .doc(configurationId)
      .update({ ...configuration });
    serverConfigurationUpdated = true;
  } catch (error) {
    //console.error(`could not push configuration: Error: ${error}`);
    Logger.logToDb(
      "push_configuration_failure",
      `Could not push configuration: ${error.message}`,
    );
  }
}

export async function patchConfiguration(
  configurationUpdates: Partial<RollingTypes.Configuration>,
): Promise<boolean> {
  try {
    const currentConfiguration = _.cloneDeep(configuration);
    mergeConfigurations(currentConfiguration, configurationUpdates);

    const oldConfiguration = (
      await db.collection("configuration").get()
    ).docs[0].data() as ConfigurationWithId;
    const configurationId = oldConfiguration.configurationId;

    await db
      .collection("configuration")
      .doc(configurationId)
      .update({ ...currentConfiguration });

    await getLiveConfiguration();
  } catch (error) {
    //console.error(`could not patch configuration ${error}`);
    Logger.logToDb(
      "patch_configuration_failure",
      `Could not patch configuration: ${error.message}`,
    );

    return false;
  }

  return true;
}
