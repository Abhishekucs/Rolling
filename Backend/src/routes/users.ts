import { Router } from "express";
import { authenticateRequest } from "../middlewares/auth";
import * as UserController from "../controllers/users";
import {
  asyncHandler,
  validateConfiguration,
  validateRequest,
} from "../middlewares/api-utils";
import Joi from "joi";
import { containsProfanity, isUsernameValid } from "../utils/validation";
import * as RateLimit from "../middlewares/rate-limit";

const router = Router();

const nameValidation = Joi.string()
  .required()
  .custom((value, helpers) => {
    if (containsProfanity(value)) {
      return helpers.error("string.profanity");
    }

    if (!isUsernameValid(value)) {
      return helpers.error("string.pattern.base");
    }

    return value;
  })
  .messages({
    "string.profanity":
      "The username contains profanity. If you believe this is a mistake, please contact us ",
    "string.pattern.base":
      "Username invalid. Name cannot use special characters or contain more than 100 characters. Can include _ . and - ",
  });

router.get(
  "/",
  authenticateRequest(),
  RateLimit.userGet,
  asyncHandler(UserController.getUser),
);

router.post(
  "/signup",
  validateConfiguration({
    criteria: (configuration) => {
      return configuration.users.signUp;
    },
    invalidMessage: "Sign up is temporarily disabled",
  }),
  authenticateRequest(),
  RateLimit.userSignup,
  validateRequest({
    body: {
      uid: Joi.string().token(),
      email: Joi.string().email(),
      name: nameValidation,
    },
  }),
  asyncHandler(UserController.createNewUser),
);

router.patch(
  "/",
  authenticateRequest({
    requireFreshToken: true,
  }),
  RateLimit.userUpdateName,
  validateRequest({
    body: {
      name: nameValidation,
    },
  }),
  asyncHandler(UserController.updateUserName),
);

router.get(
  "/verificationEmail",
  authenticateRequest(),
  RateLimit.userRequestVerificationEmail,
  asyncHandler(UserController.sendVerificationEmail),
);

router.post(
  "/forgotPasswordEmail",
  RateLimit.userForgotPasswordEmail,
  validateRequest({
    body: {
      email: Joi.string().email().required(),
    },
  }),
  asyncHandler(UserController.sendForgotPasswordEmail),
);

router.delete(
  "/",
  authenticateRequest({
    requireFreshToken: true,
  }),
  RateLimit.userDelete,
  asyncHandler(UserController.deleteUser),
);

router.post(
  "/revokeAllTokens",
  authenticateRequest({
    requireFreshToken: true,
  }),
  RateLimit.userRevokeAllTokens,
  asyncHandler(UserController.revokeAllTokens),
);

export default router;
