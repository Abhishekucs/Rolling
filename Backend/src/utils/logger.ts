import chalk from "chalk";
import { resolve } from "path";
import winston, { format } from "winston";
import * as db from "../init/db";
import { v4 as uuidV4 } from "uuid";

const errorColor = chalk.red.bold;
const warningColor = chalk.yellow.bold;
const successColor = chalk.green.bold;
const infoColor = chalk.white;

const logFolderPath = process.env.LOG_FOLDER_PATH ?? "./logs";
const maxLogSize = parseInt(process.env.LOG_FILE_MAX_SIZE ?? "10485760");

const customLevels = {
  error: 0,
  warning: 1,
  info: 2,
  success: 3,
};

const timestampFormat = format.timestamp({
  format: "DD-MM-YYYY HH:mm:ss.SSS",
});

const simpleOutputFormat = format.printf((log) => {
  return `${log.timestamp}\t${log.level}: ${log.message}`;
});

const coloredOutputFormat = format.printf((log) => {
  let color = infoColor;

  switch (log.level) {
    case "error":
      color = errorColor;
      break;
    case "warning":
      color = warningColor;
      break;
    case "success":
      color = successColor;
      break;
  }

  return `${log.timestamp}\t${color(log.message)}`;
});

const fileFormat = format.combine(timestampFormat, simpleOutputFormat);

const consoleFormat = format.combine(timestampFormat, coloredOutputFormat);

const logger = winston.createLogger({
  levels: customLevels,
  transports: [
    new winston.transports.File({
      level: "error",
      filename: resolve(logFolderPath, "error.log"),
      maxsize: maxLogSize,
      format: fileFormat,
    }),
    new winston.transports.File({
      level: "success",
      filename: resolve(logFolderPath, "combined.log"),
      maxsize: maxLogSize,
      format: fileFormat,
    }),
    new winston.transports.Console({
      level: "success",
      format: consoleFormat,
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: resolve(logFolderPath, "exceptions.log"),
      format: fileFormat,
    }),
  ],
});

const logToDb = async (
  event: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  message: any,
  uid?: string,
): Promise<void> => {
  const logsCollection = db.collection<RollingTypes.Log>("logs");

  logger.info(`${event}\t${uid}\t${JSON.stringify(message)}`);
  const logId = uuidV4();
  await logsCollection
    .doc(logId)
    .set({
      timestamp: Date.now(),
      uid: uid ?? "",
      event,
      message,
    })
    .catch((error) => {
      logger.error(`Could not log to db: ${error.message}`);
    });
};

const Logger = {
  error: (message: string): winston.Logger => logger.error(message),
  warning: (message: string): winston.Logger => logger.warning(message),
  info: (message: string): winston.Logger => logger.info(message),
  success: (message: string): winston.Logger => logger.log("success", message),
  logToDb,
};

export default Logger;
