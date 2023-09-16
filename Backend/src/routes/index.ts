import _ from "lodash";
import {
  Application,
  Router,
  Response,
  NextFunction,
  static as expressStatic,
} from "express";
import admin from "./admin";
import users from "./users";
import address from "./address";
import product from "./product";
import { RollingResponse } from "../utils/rolling-response";
import { asyncHandler } from "../middlewares/api-utils";
import configuration from "./configuration";
import { join } from "path";

const pathOverride = process.env.PATH_OVERRIDE;
const BASE_ROUTE = pathOverride ? `/${pathOverride}` : "";
const APP_START_TIME = Date.now();

const API_ROUTE_MAP = {
  "/admin": admin,
  "/user": users,
  "/address": address,
  "/product": product,
};

function addApiRoutes(app: Application): void {
  app.use("/configuration", configuration);

  if (process.env.MODE === "dev") {
    app.use("/configure", expressStatic(join(__dirname, "../../private")));
  }

  app.use(
    (req: RollingTypes.Request, res: Response, next: NextFunction): void => {
      const inMaintenance =
        process.env.MAINTENANCE === "true" || req.ctx.configuration.maintenance;

      if (inMaintenance) {
        res.status(503).json({ message: "Server is down for maintenance" });
        return;
      }

      //   if (req.path === "/psas") {
      //     const clientVersion =
      //       req.headers["x-client-version"] || req.headers["client-version"];
      //     recordClientVersion(clientVersion?.toString() ?? "unknown");
      //   }

      next();
    },
  );
  app.get(
    "/",
    asyncHandler(async (_req, _res) => {
      return new RollingResponse("ok", {
        uptime: Date.now() - APP_START_TIME,
        version: "1.0.0",
      });
    }),
  );

  _.each(API_ROUTE_MAP, (router: Router, route) => {
    const apiRoute = `${BASE_ROUTE}${route}`;
    app.use(apiRoute, router);
  });

  app.use(
    asyncHandler(async (req, _res) => {
      return new RollingResponse(
        `Unknown request URL (${req.method}: ${req.path})`,
        null,
        404,
      );
    }),
  );
}

export default addApiRoutes;
