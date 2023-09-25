import { Response } from "express";
import { register } from "../utils/metrics";
import RollingError from "../utils/error";

export async function getMetrics(
  _req: RollingTypes.Request,
  res: Response,
): Promise<Response> {
  try {
    res.set("Content-Type", register.contentType);
    return res.end(await register.metrics());
  } catch (error) {
    throw new RollingError(500, error);
  }
}
