import _ from "lodash";
import { Application, Router } from "express";
import admin from "./admin";
import users from "./users";
import address from "./address";
import product from "./product";
import { RollingResponse } from "../utils/rolling-response";
import { asyncHandler } from "../middlewares/api-utils";

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
