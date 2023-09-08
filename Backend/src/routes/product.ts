import joi from "joi";
import { Router } from "express";
import { authenticateRequest } from "../middlewares/auth";
import {
  asyncHandler,
  checkIfUserIsAdmin,
  handleImage,
  validateRequest,
} from "../middlewares/api-utils";
import * as ProductController from "../controllers/product";

const router = Router();

// product
// add product - admin
// update product - admin
// get all product - admin,users
// delete product - admin
// get product by id - admin, users
// filter product - admin, users

const BASE_PRODUCT_VALIDATION_SCHEMA = {
  category: joi.string().valid("tshirt", "hoodie"),
  color: joi.string(),
  pricetag: joi.string().valid("expensive", "cheap"),
  instock: joi.boolean().required(),
  tag: joi.string().valid("new", "old"),
};

const PRODUCT_VALIDATION_SCHEMA_WITH_LIMIT = {
  ...BASE_PRODUCT_VALIDATION_SCHEMA,
  skip: joi.number().min(0),
  limit: joi.number().min(0).max(50),
};

router.get(
  "/",
  authenticateRequest({
    isPublic: true,
  }),
  validateRequest({
    query: PRODUCT_VALIDATION_SCHEMA_WITH_LIMIT,
  }),
  asyncHandler(ProductController.getAllProducts),
);

router.post(
  "/",
  authenticateRequest(),
  //   validateRequest({
  //     body: {
  //       category: joi.string().valid("tshirt", "hoodie").required(),
  //       name: joi.string().min(1).required(),
  //       price: joi.number().min(0).required(),
  //       tag: joi.string().valid("old", "new").required(),
  //       priceTag: joi.string().valid("expensive", "cheap").required(),
  //       inStock: joi.boolean().required(),
  //       color: joi.string().required(),
  //       size: joi.string().valid("xs", "s", "m", "l", "xl", "xxl").required(),
  //       description: joi.array().items(joi.string()).required(),
  //     },
  //   }),
  handleImage(),
  checkIfUserIsAdmin(),
  asyncHandler(ProductController.createNewProduct),
);

export default router;
