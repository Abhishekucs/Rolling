import joi from "joi";
import { Router } from "express";
import { authenticateRequest } from "../middlewares/auth";
import {
  asyncHandler,
  checkIfUserIsAdmin,
  handleImage,
  validateConfiguration,
  validateRequest,
} from "../middlewares/api-utils";
import * as ProductController from "../controllers/product";
import { isValidUuidV4 } from "../utils/validation";
import * as RateLimit from "../middlewares/rate-limit";

const router = Router();

const BASE_PRODUCT_VALIDATION_SCHEMA = {
  category: joi.string().valid("tshirt", "hoodie"),
  color: joi.string(),
  filter: joi.string().valid("expensive", "cheap", "new", "old", "instock"),
};

const PRODUCT_VALIDATION_SCHEMA_WITH_LIMIT = {
  ...BASE_PRODUCT_VALIDATION_SCHEMA,
  skip: joi.number().min(0),
  limit: joi.number().min(0).max(50),
};

const idValidation = joi
  .string()
  .custom((value, helpers) => {
    if (!isValidUuidV4(value)) {
      return helpers.error("string.pattern.base");
    }
    return value;
  })
  .messages({
    "string.pattern.base": "Invalid Product Id",
  })
  .required();

const sizesValidation = joi
  .array()
  .items(
    joi
      .object()
      .pattern(
        joi.string().valid("xs", "s", "m", "l", "xl", "xxl").required(),
        joi.number().min(0).required(),
      ),
  );

router.get(
  "/",
  authenticateRequest({
    isPublic: true,
  }),
  RateLimit.productGetAll,
  validateRequest({
    query: PRODUCT_VALIDATION_SCHEMA_WITH_LIMIT,
  }),
  asyncHandler(ProductController.getAllProducts),
);

router.post(
  "/",
  validateConfiguration({
    criteria: (configuration) => {
      return configuration.product.submissionEnabled;
    },
    invalidMessage: "Product Submission is temporarily disabled",
  }),
  authenticateRequest(),
  RateLimit.productAdd,
  validateRequest({
    body: {
      category: joi.string().valid("tshirt", "hoodie").required(),
      name: joi.string().min(1).required(),
      description: joi.array().items(joi.string().min(1).required()).required(),
    },
  }),
  checkIfUserIsAdmin(),
  asyncHandler(ProductController.createNewProduct),
);

router.post(
  "/:productId/variant",
  authenticateRequest(),
  RateLimit.productAddVariant,
  handleImage(),
  validateRequest({
    body: {
      color: joi.string().required(),
      price: joi.number().min(0).required(),
      sizes: sizesValidation,
    },
    params: {
      productId: idValidation,
    },
  }),
  checkIfUserIsAdmin(),
  asyncHandler(ProductController.createNewVariation),
);

router.get(
  "/:productId",
  authenticateRequest({
    isPublic: true,
  }),
  RateLimit.productGetById,
  validateRequest({
    params: {
      productId: idValidation,
    },
  }),
  asyncHandler(ProductController.getProductById),
);

router.patch(
  "/:productId",
  authenticateRequest(),
  RateLimit.productUpdate,
  validateRequest({
    body: {
      name: joi.string().min(1),
      previousName: joi.string().min(1),
      description: joi.array<string>().items(joi.string().min(1).required()),
    },
  }),
  checkIfUserIsAdmin(),
  asyncHandler(ProductController.updateProduct),
);

router.patch(
  "/:productId/variant/:variantId",
  authenticateRequest(),
  RateLimit.productVariantUpdate,
  handleImage(),
  validateRequest({
    body: {
      price: joi.number().min(0),
      sizes: sizesValidation,
    },
    params: {
      productId: idValidation,
      variantId: idValidation,
    },
  }),
  checkIfUserIsAdmin(),
  asyncHandler(ProductController.updateVariant),
);

router.delete(
  "/:productId",
  authenticateRequest({
    requireFreshToken: true,
  }),
  RateLimit.productDelete,
  validateRequest({
    params: {
      productId: idValidation,
    },
  }),
  checkIfUserIsAdmin(),
  asyncHandler(ProductController.deleteProduct),
);
export default router;
