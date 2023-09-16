import * as Configuration from "../init/configuration";
import { CONFIGURATION_FORM_SCHEMA } from "../schemas/configuration-schema";
import { RollingResponse } from "../utils/rolling-response";

export async function getConfiguration(
  _req: RollingTypes.Request,
): Promise<RollingResponse> {
  const currentConfiguration = await Configuration.getLiveConfiguration();
  return new RollingResponse("Configuration retrieved", currentConfiguration);
}

export async function getSchema(
  _req: RollingTypes.Request,
): Promise<RollingResponse> {
  return new RollingResponse(
    "Configuration schema retrieved",
    CONFIGURATION_FORM_SCHEMA,
  );
}

export async function updateConfiguration(
  req: RollingTypes.Request,
): Promise<RollingResponse> {
  const { configuration } = req.body;
  const success = await Configuration.patchConfiguration(configuration);

  if (!success) {
    return new RollingResponse("Configuration update failed", {}, 500);
  }

  return new RollingResponse("Configuration updated");
}
