import { Router } from "express";
import { authenticateRequest } from "../middlewares/auth";
import { asyncHandler, validateRequest } from "../middlewares/api-utils";
import joi from "joi";
import { isValidUuidV4 } from "../utils/validation";
import * as CartController from "../controllers/cart";

const router = Router();

/**
 * all this for user who is logged in
 * get cart items
 * add item/s to cart
 * delete item/s from cart
 * update item/s in the cart
 */

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
  validateRequest({
    body: {
      productId: idValidation,
      variantId: idValidation,
      size: joi.string().valid("xs", "s", "m", "l", "xl", "xxl").required(),
      quantity: joi.number().min(1).required(),
      price: joi.number().min(0).required(),
    },
  }),
  asyncHandler(CartController.addToCart),
);

router.get("/", authenticateRequest(), asyncHandler(CartController.getCart));

router.delete(
  "/:productId",
  authenticateRequest({
    requireFreshToken: true,
  }),
  validateRequest({
    params: {
      productId: idValidation,
    },
  }),
  asyncHandler(CartController.deleteProduct),
);

export default router;
