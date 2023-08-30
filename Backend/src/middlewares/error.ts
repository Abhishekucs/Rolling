import { NextFunction, Response } from "express";
import RollingError from "../utils/error";
import {
  RollingResponse,
  handleRollingResponse,
} from "../utils/rolling-response";
import { v4 as uuidv4 } from "uuid";
import Logger from "../utils/logger";

async function errorHandlingMiddleware(
  error: Error,
  req: RollingTypes.Request,
  res: Response,
  _next: NextFunction
): Promise<void> {
  try {
    const rollingError = error as RollingError;

    const rollingResponse = new RollingResponse();
    rollingResponse.status = 500;
    rollingResponse.data = {
      errorId: rollingError.errorId ?? uuidv4(),
      uid: rollingError.uid ?? req.ctx?.decodedToken?.uid,
    };

    //handle database error below
    if (/ECONNREFUSED.*27017/i.test(error.message)) {
      rollingResponse.message =
        "Could not connect to the database. It may be down.";
    } else if (error instanceof URIError || error instanceof SyntaxError) {
      rollingResponse.status = 400;
      rollingResponse.message = "Unprocessable request";
    } else if (error instanceof RollingError) {
      rollingResponse.message = error.message;
      rollingResponse.status = error.status;
    } else {
      rollingResponse.message = `Oops! We kept Rolling. Please try again later. - ${rollingResponse.data.errorId}`;
    }

    if (rollingResponse.status < 500) {
      delete rollingResponse.data["errorId"];
    }

    return handleRollingResponse(rollingResponse, res);
  } catch (error) {
    Logger.error("Error handling middleware failed.");
    Logger.error(error);
  }

  return handleRollingResponse(
    new RollingResponse(
      "Something went really wrong, please contact support.",
      undefined,
      500
    ),
    res
  );
}

export default errorHandlingMiddleware;
