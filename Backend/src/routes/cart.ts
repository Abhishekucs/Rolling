import { Router } from "express";
import { authenticateRequest } from "../middlewares/auth";
import { asyncHandler, validateRequest } from "../middlewares/api-utils";
import joi from "joi";
import { isValidUuidV4 } from "../utils/validation";
import * as CartController from "../controllers/cart";
import * as RateLimit from "../middlewares/rate-limit";

const router = Router();

const idValidation = joi
  .string()
  .custom((value, helpers) => {
    if (!isValidUuidV4(value)) {
      return helpers.error("string.pattern.base");
    }
    return value;
  })
  .messages({
    "string.pattern.base": "Invalid Id",
  })
  .required();

router.post(
  "/",
  authenticateRequest(),
  RateLimit.cartAdd,
  validateRequest({
    body: {
      productId: idValidation,
      variantId: idValidation,
      size: joi.string().valid("xs", "s", "m", "l", "xl", "xxl").required(),
      quantity: joi.number().min(1).required(),
      price: joi.number().min(0).required(),
      name: joi.string().required(),
    },
  }),
  asyncHandler(CartController.addToCart),
);

router.get(
  "/",
  authenticateRequest(),
  RateLimit.cartGet,
  asyncHandler(CartController.getCart),
);

router.patch(
  "/:cartItemId",
  authenticateRequest(),
  RateLimit.cartUpdateItem,
  validateRequest({
    body: {
      quantity: joi.number().min(1),
      size: joi.string().valid("xs", "s", "m", "l", "xl", "xxl"),
    },
    params: {
      cartItemId: idValidation,
    },
  }),
  asyncHandler(CartController.updateItem),
);

router.delete(
  "/:cartItemid",
  authenticateRequest({
    requireFreshToken: true,
  }),
  RateLimit.cartItemDelete,
  validateRequest({
    params: {
      cartItemid: idValidation,
    },
  }),
  asyncHandler(CartController.deleteProduct),
);

export default router;
