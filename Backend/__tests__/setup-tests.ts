import { Collection, Db, MongoClient, WithId } from "mongodb";

process.env.MODE = "dev";

jest.mock("../src/init/db", () => ({
  __esModule: true,
  getDb: (): Db => db,
  collection: <T>(name: string): Collection<WithId<T>> =>
    db.collection<WithId<T>>(name),
}));

jest.mock("../src/utils/logger", () => ({
  __esModule: true,
  default: {
    error: console.error,
    warning: console.warn,
    info: console.info,
    success: console.info,
    logToDb: console.info,
  },
}));

if (!process.env.REDIS_URI) {
  // use mock if not set
  process.env.REDIS_URI = "redis://mock";
  jest.mock("ioredis", () => require("ioredis-mock"));
}

jest.mock("firebase-admin", () => ({
  __esModule: true,
  default: {
    auth: (): unknown => ({
      verifyIdToken: (
        _token: string,
        _checkRevoked: boolean,
      ): unknown /* Promise<DecodedIdToken> */ =>
        Promise.resolve({
          aud: "mockFirebaseProjectId",
          auth_time: 123,
          exp: 1000,
          uid: "mockUid",
        }),
    }),
  },
}));

const collectionsForCleanUp = [
  "users",
  "addresses",
  "products",
  "order",
  "cart",
];

let db: Db;
let connection: MongoClient;
beforeAll(async () => {
  connection = await MongoClient.connect(global.__MONGO_URI__);
  db = connection.db();
});

beforeEach(async () => {
  if (global.__MONGO_URI__) {
    await Promise.all(
      collectionsForCleanUp.map((collection) =>
        db.collection(collection).deleteMany({}),
      ),
    );
  }
});

const realDateNow = Date.now;

afterEach(() => {
  Date.now = realDateNow;
});

afterAll(async () => {
  await connection.close();
});
