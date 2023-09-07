import { Response, RequestHandler, NextFunction } from "express";
import {
  RollingResponse,
  handleRollingResponse,
} from "../utils/rolling-response";
import _ from "lodash";
import joi from "joi";
import RollingError from "../utils/error";

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

export { asyncHandler, validateRequest };
