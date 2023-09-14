import express, { json, urlencoded } from "express";
import cors from "cors";
import addApiRoutes from "./routes";
import errorHandlingMiddleware from "./middlewares/error";
import helmet from "helmet";
import {
  badAuthRateLimiterHandler,
  rootRateLimiter,
} from "./middlewares/rate-limit";

function buildApp(): express.Application {
  const app = express();

  app.use(urlencoded({ extended: true }));
  app.use(json());
  app.use(cors());
  app.use(helmet());

  app.set("trust proxy", 1);

  app.use(badAuthRateLimiterHandler);
  app.use(rootRateLimiter);

  addApiRoutes(app);

  app.use(errorHandlingMiddleware);

  return app;
}

export default buildApp();
