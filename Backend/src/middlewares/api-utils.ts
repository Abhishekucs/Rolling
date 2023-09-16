import { Response, RequestHandler, NextFunction } from "express";
import {
  RollingResponse,
  handleRollingResponse,
} from "../utils/rolling-response";
import _ from "lodash";
import joi from "joi";
import RollingError from "../utils/error";
import multer from "multer";
import { isAdmin } from "../dal/admin";
import fs from "fs";

interface ValidationOptions<T> {
  criteria: (data: T) => boolean;
  invalidMessage?: string;
}

/**
 * This utility checks that the server's configuration matches
 * the criteria.
 */
function validateConfiguration(
  options: ValidationOptions<RollingTypes.Configuration>,
): RequestHandler {
  const {
    criteria,
    invalidMessage = "This service is currently unavailable.",
  } = options;

  return (req: RollingTypes.Request, _res: Response, next: NextFunction) => {
    const configuration = req.ctx.configuration;

    const validated = criteria(configuration);
    if (!validated) {
      throw new RollingError(503, invalidMessage);
    }

    next();
  };
}

const emptyMiddleware = (
  _req: RollingTypes.Request,
  _res: Response,
  next: NextFunction,
): void => next();

type AsyncHandler = (
  req: RollingTypes.Request,
  res?: Response,
) => Promise<RollingResponse>;

function asyncHandler(handler: AsyncHandler): RequestHandler {
  return async (
    req: RollingTypes.Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const handlerData = await handler(req, res);
      return handleRollingResponse(handlerData, res);
    } catch (error) {
      next(error);
    }
  };
}

interface ValidationSchema {
  body?: object;
  query?: object;
  params?: object;
  validationErrorMessage?: string;
}

function validateRequest(validationSchema: ValidationSchema): RequestHandler {
  /**
   * In dev environments, as an alternative to token authentication,
   * you can pass the authentication middleware by having a user id in the body.
   * Inject the user id into the schema so that validation will not fail.
   */
  if (process.env.MODE === "dev") {
    validationSchema.body = {
      uid: joi.any(),
      ...(validationSchema.body ?? {}),
    };
  }

  const { validationErrorMessage } = validationSchema;
  const normalizedValidationSchema: ValidationSchema = _.omit(
    validationSchema,
    "validationErrorMessage",
  );

  return (req: RollingTypes.Request, _res: Response, next: NextFunction) => {
    _.each(
      normalizedValidationSchema,
      (schema: object, key: keyof ValidationSchema) => {
        const joiSchema = joi.object().keys(schema);

        const { error } = joiSchema.validate(req[key] ?? {});
        if (error) {
          const errorMessage = error.details[0].message;
          throw new RollingError(
            422,
            validationErrorMessage ??
              `${errorMessage} (${error.details[0]?.context?.value})`,
          );
        }
      },
    );

    next();
  };
}

/** This middleware is used to handle images from the request
 * (When number of files exceed the maxCount the error is Unexpected Field)
 */

function handleImage(): RequestHandler {
  const directoryPath = "/tmp/uploads";

  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
  const storage = multer.diskStorage({
    destination: (_req, _file, cb): void => {
      cb(null, "/tmp/uploads");
    },
    filename: (_req, file, cb): void => {
      const extension = file.originalname.split(".")[1];
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

      const newFilename = uniqueSuffix + "." + extension;
      cb(null, newFilename);
    },
  });

  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 10485760,
    },
    fileFilter: (_req, file, cb): void => {
      const fileTypes = /(^image)(\/)(jpe?g|png)$/i;
      const mimetype = fileTypes.test(file.mimetype);

      if (mimetype) {
        return cb(null, true);
      }
      cb(new RollingError(403, `unsupported fileType - ${file.mimetype}`));
    },
  });

  return (req: RollingTypes.Request, res: Response, next: NextFunction) => {
    // return upload.array("images", 5);

    // @ts-nocheck
    upload.array("images", 5)(req, res, (err: unknown) => {
      if (err) {
        next(err);
      } else {
        next();
      }
    });
  };
}

/**
 * Check if the user is an admin before handling request.
 * Note that this middleware must be used after authentication in the middleware stack.
 */
function checkIfUserIsAdmin(): RequestHandler {
  return async (
    req: RollingTypes.Request,
    _res: Response,
    next: NextFunction,
  ) => {
    try {
      const { uid } = req.ctx.decodedToken;
      const admin = await isAdmin(uid);

      if (!admin) {
        throw new RollingError(403, "You don't have permission to do this.");
      }
    } catch (error) {
      next(error);
    }

    next();
  };
}

/**
 * Uses the middlewares only in production. Otherwise, uses an empty middleware.
 */
function useInProduction(middlewares: RequestHandler[]): RequestHandler[] {
  return middlewares.map((middleware) =>
    process.env.MODE === "dev" ? emptyMiddleware : middleware,
  );
}

export {
  asyncHandler,
  validateRequest,
  handleImage,
  checkIfUserIsAdmin,
  useInProduction,
  validateConfiguration,
};
