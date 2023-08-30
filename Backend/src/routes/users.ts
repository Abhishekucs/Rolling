import { Router } from "express";
import { authenticateRequest } from "../middlewares/auth";
import * as UserController from "../controllers/users";
import { asyncHandler, validateRequest } from "../middlewares/api-utils";
import Joi from "joi";
import { containsProfanity, isUsernameValid } from "../utils/validation";

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
      "Username invalid. Name cannot use special characters or contain more than 16 characters. Can include _ . and - ",
  });

router.get("/", authenticateRequest(), asyncHandler(UserController.getUser));

router.post(
  "/signup",
  authenticateRequest(),
  validateRequest({
    body: {
      uid: Joi.string().token(),
      email: Joi.string().email(),
    },
  }),
  asyncHandler(UserController.createNewUser)
);

router.patch(
  "/",
  authenticateRequest({
    requireFreshToken: true,
  }),
  validateRequest({
    body: {
      name: nameValidation,
    },
  }),
  asyncHandler(UserController.updateUserName)
);

router.get(
  "/verificationEmail",
  authenticateRequest(),
  asyncHandler(UserController.sendVerificationEmail)
);

router.post(
  "/forgotPasswordEmail",
  validateRequest({
    body: {
      email: Joi.string().email().required(),
    },
  }),
  asyncHandler(UserController.sendForgotPasswordEmail)
);

router.delete(
  "/",
  authenticateRequest({
    requireFreshToken: true,
  }),
  asyncHandler(UserController.deleteUser)
);

export default router;
