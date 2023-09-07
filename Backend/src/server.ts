import "dotenv/config";
import { Server } from "http";
import app from "./app";
import { init as initFirebaseAdmin } from "./init/firebase-admin";
import Logger from "./utils/logger";
import * as RedisClient from "./init/redis";
import queues from "./queues";
import workers from "./workers";
import * as EmailClient from "./init/email-client";

async function bootserver(port: number): Promise<Server> {
  try {
    Logger.info(`Starting server in ${process.env.MODE} mode`);

    Logger.info("Initializing Firebase app instance...");
    initFirebaseAdmin();

    Logger.info("Initializing email client...");
    EmailClient.init();

    Logger.info("Connecting to redis...");
    await RedisClient.connect();

    if (RedisClient.isConnected()) {
      Logger.success("Connected to redis");
      const connection = RedisClient.getConnection();

      Logger.info("Initializing queues...");
      queues.forEach((queue) => {
        queue.init(connection);
      });
      Logger.success(
        `Queues initialized: ${queues
          .map((queue) => queue.queueName)
          .join(", ")}`
      );

      Logger.info("Initializing workers...");
      workers.forEach((worker) => {
        worker(connection).run();
      });
      Logger.success(
        `Workers initialized: ${workers
          .map((worker) => worker(connection).name)
          .join(", ")}`
      );
    }
  } catch (error) {
    Logger.error("Failed to boot server");
    Logger.error(error.message);
    console.error(error);
    return process.exit(1);
  }

  return app.listen(PORT, () => {
    Logger.success(`API server listening on port ${port}`);
  });
}

const PORT = parseInt(process.env.PORT ?? "4000");

bootserver(PORT);
