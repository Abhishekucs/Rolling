import { Router } from "express";
import {
  containsProfanity,
  isUsernameValid,
  isValidMobileNumber,
  isValidMongodbId,
  isValidPincode,
} from "../utils/validation";
import Joi from "joi";
import { authenticateRequest } from "../middlewares/auth";
import {
  asyncHandler,
  validateConfiguration,
  validateRequest,
} from "../middlewares/api-utils";
import * as AddressController from "../controllers/address";
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
      "Username invalid. Name cannot use special characters or contain more than 16 characters. Can include _ . and - ",
  });

const addressValidation = Joi.string().required().min(1);

const pincodeValidaton = Joi.number()
  .required()
  .custom((value, helpers) => {
    if (!isValidPincode(value)) {
      return helpers.error("number.pattern.base");
    }

    return value;
  })
  .messages({
    "number.pattern.base": "Pincode invalid.",
  });

const mobileNumberValidation = Joi.number()
  .required()
  .custom((value, helpers) => {
    if (!isValidMobileNumber(value)) {
      return helpers.error("number.patten.base");
    }
    return value;
  })
  .messages({
    "number.pattern.base": "MobileNumber invalid.",
  });

const addressIdValidation = Joi.string()
  .required()
  .custom((value, helpers) => {
    if (!isValidMongodbId(value)) {
      return helpers.error("string.pattern.base");
    }
    return value;
  })
  .messages({
    "string.pattern.base": "Invalid addressId",
  });

router.get(
  "/",
  authenticateRequest(),
  RateLimit.addressGetAll,
  asyncHandler(AddressController.getAllAddress),
);

router.post(
  "/",
  validateConfiguration({
    criteria: (configuration) => {
      return configuration.address.submissionEnabled;
    },
    invalidMessage: "Address Submission is temporarily disabled",
  }),
  authenticateRequest(),
  RateLimit.addressAdd,
  validateRequest({
    body: {
      name: nameValidation,
      address1: addressValidation,
      address2: addressValidation,
      landmark: addressValidation,
      pincode: pincodeValidaton,
      state: Joi.string().required(),
      city: Joi.string().required(),
      defaultAddress: Joi.boolean().required(),
      mobileNumber: mobileNumberValidation,
    },
  }),
  asyncHandler(AddressController.createNewAddress),
);

router.patch(
  "/:id",
  authenticateRequest(),
  RateLimit.addressUpdate,
  validateRequest({
    body: {
      name: nameValidation,
      address1: addressValidation,
      address2: addressValidation,
      landmark: addressValidation,
      pincode: pincodeValidaton,
      state: Joi.string().required(),
      city: Joi.string().required(),
      defaultAddress: Joi.boolean().required(),
      mobileNumber: mobileNumberValidation,
    },
    params: {
      id: addressIdValidation,
    },
  }),
  asyncHandler(AddressController.updateAddress),
);

router.delete(
  "/:id",
  authenticateRequest({
    requireFreshToken: true,
  }),
  RateLimit.addressDelete,
  validateRequest({
    params: {
      id: addressIdValidation,
    },
  }),
  asyncHandler(AddressController.deleteAddress),
);

export default router;
