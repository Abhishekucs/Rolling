process.env.MODE = "dev";

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
