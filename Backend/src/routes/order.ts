import Router from "express";
import { authenticateRequest } from "../middlewares/auth";
import {
  asyncHandler,
  validateConfiguration,
  validateRequest,
} from "../middlewares/api-utils";
import joi from "joi";
import * as PaymentController from "../controllers/order";
import { isValidMongodbId } from "../utils/validation";

const router = Router();

/**
 * create order
 * update order
 * delete order
 */

const idValidation = joi
  .string()
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

router.post(
  "/",
  validateConfiguration({
    criteria: (configuration) => {
      return configuration.order.orderPlacingEnabled;
    },
    invalidMessage: "Order Placing is temporarily disabled",
  }),
  authenticateRequest(),
  validateRequest({
    query: {
      addressId: idValidation,
    },
  }),
  asyncHandler(PaymentController.createOrder),
);

export default router;
