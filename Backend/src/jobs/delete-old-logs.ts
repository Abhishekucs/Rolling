import { CronJob } from "cron";
import * as db from "../init/db";
import Logger from "../utils/logger";
import { getCachedConfiguration } from "../init/configuration";

const CRON_SCHEDULE = "0 0 0 * * *";
const LOG_MAX_AGE_DAYS = 30;
const LOG_MAX_AGE_MILLISECONDS = LOG_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

async function deleteOldLogs(): Promise<void> {
  const { maintenance } = await getCachedConfiguration();
  if (maintenance) {
    return;
  }

  const docs = (await db.collection("logs").get()).docs;
  let deletedCount = 0;
  docs.forEach((doc) => {
    const timestamp = Date.now() - LOG_MAX_AGE_MILLISECONDS;
    const data = doc.data() as RollingTypes.Log;
    if (data.timestamp > timestamp) {
      deletedCount += 1;
      doc.ref.delete();
    }
  });

  Logger.logToDb(
    "system_logs_deleted",
    `${deletedCount} logs deleted older than ${LOG_MAX_AGE_DAYS} day(s)`,
    undefined,
  );
}

export default new CronJob(CRON_SCHEDULE, deleteOldLogs);
