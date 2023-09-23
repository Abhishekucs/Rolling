import {
  Collection,
  Db,
  MongoClient,
  MongoClientOptions,
  WithId,
} from "mongodb";
import RollingError from "../utils/error";
import Logger from "../utils/logger";

let db: Db;

export async function connect(): Promise<void> {
  const { DB_USERNAME, DB_PASSWORD, DB_URI, DB_NAME } = process.env;

  if (!DB_URI || !DB_NAME) {
    throw new Error("No database configuration provided");
  }

  const connectionOptions: MongoClientOptions = {
    ignoreUndefined: true,
    connectTimeoutMS: 2000,
    serverSelectionTimeoutMS: 2000,
    auth: !(DB_USERNAME && DB_PASSWORD)
      ? undefined
      : {
          username: DB_USERNAME,
          password: DB_PASSWORD,
        },
    appName: "Rolling",
  };

  const mongoClient = new MongoClient(
    (DB_URI as string) ?? global.__MONGO_URI__, // Set in tests only
    connectionOptions,
  );

  try {
    await mongoClient.connect();
    db = mongoClient.db(DB_NAME);
  } catch (error) {
    Logger.error(error.message);
    Logger.error(
      "Failed to connect to database. Exiting with exit status code 1.",
    );
    process.exit(1);
  }
}

export const getDb = (): Db | undefined => db;

export function collection<T>(collectionName: string): Collection<WithId<T>> {
  if (!db) {
    throw new RollingError(500, "Database is not initialized.");
  }

  return db.collection<WithId<T>>(collectionName);
}
