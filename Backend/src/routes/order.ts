import Router from "express";
import { authenticateRequest } from "../middlewares/auth";
import { asyncHandler, validateRequest } from "../middlewares/api-utils";
import joi from "joi";
import * as PaymentController from "../controllers/order";
import { isValidUuidV4 } from "../utils/validation";

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
    if (!isValidUuidV4(value)) {
      return helpers.error("string.pattern.base");
    }
    return value;
  })
  .messages({
    "string.pattern.base": "Invalid addressId",
  });

router.post(
  "/",
  authenticateRequest(),
  validateRequest({
    query: {
      addressId: idValidation,
    },
  }),
  asyncHandler(PaymentController.createOrder),
);

export default router;
