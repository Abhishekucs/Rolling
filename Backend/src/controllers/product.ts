import { RollingResponse } from "../utils/rolling-response";
import * as ProductDAL from "../dal/product";
import _ from "lodash";
import RollingError from "../utils/error";
import Logger from "../utils/logger";
import { ObjectId } from "mongodb";

export async function getAllProducts(
  req: RollingTypes.Request,
): Promise<RollingResponse> {
  const { category, filter, color, skip = 0, limit = 50 } = req.query;

  const queryLimit = Math.min(parseInt(limit as string, 10), 50);

  const products = await ProductDAL.getProducts("getAllProducts", {
    skip: parseInt(skip as string, 10),
    limit: queryLimit,
    category: category as RollingTypes.CategoryType,
    sortBy: filter as RollingTypes.sort,
    color: color as string,
  });

  return new RollingResponse("product retrieved", products);
}

export async function createNewProduct(
  req: RollingTypes.Request,
): Promise<RollingResponse> {
  const { uid } = req.ctx.decodedToken;
  const { category, name, description } = req.body;

  const product: RollingTypes.Product = {
    _id: new ObjectId(),
    category,
    name,
    description,
    totalSKU: 0,
    createdAt: Date.now(),
    modifiedAt: Date.now(),
    variants: [],
  };
  const insertedId = await ProductDAL.createProduct(product);

  Logger.logToDb(
    "product created",
    `product with category:${category} and name:${name}`,
    uid,
  );

  return new RollingResponse("product created", insertedId);
}

export async function createNewVariation(
  req: RollingTypes.Request,
): Promise<RollingResponse> {
  const { uid } = req.ctx.decodedToken;
  const productId = req.params["productId"];

  const product = await ProductDAL.getProductById(productId);

  if (!product) {
    throw new RollingError(404, "product not founde", "createNewVariation");
  }

  const { color, price, sizes } = req.body;
  const images = req.files as Express.Multer.File[];

  await ProductDAL.createVariation(
    sizes,
    color,
    product.name,
    images,
    product.totalSKU,
    price,
    productId,
  );

  Logger.logToDb(
    "product variant created",
    `product variant for productId ${productId}`,
    uid,
  );

  return new RollingResponse("variant created");
}

export async function getProductById(
  req: RollingTypes.Request,
): Promise<RollingResponse> {
  const productId = req.params["productId"];

  const product = await ProductDAL.getProductById(productId);

  return new RollingResponse("Product recieved", product);
}

export async function updateProduct(
  req: RollingTypes.Request,
): Promise<RollingResponse> {
  const productId = req.params["productId"];

  const { name, previousName, description } = req.body;

  await ProductDAL.updateProduct(name, previousName, description, productId);
  return new RollingResponse("product updated successfully");
}

export async function updateVariant(
  req: RollingTypes.Request,
): Promise<RollingResponse> {
  const productId = req.params["productId"];
  const variantId = req.params["variantId"];
  const { sizes, price } = req.body;
  const images = req.files as Express.Multer.File[];

  await ProductDAL.updateVariant(sizes, price, images, variantId, productId);

  return new RollingResponse("variant updated successfully");
}

export async function deleteProduct(
  req: RollingTypes.Request,
): Promise<RollingResponse> {
  const { uid } = req.ctx.decodedToken;
  const productId = req.params["productId"];

  await ProductDAL.deleteProductById(productId);

  Logger.logToDb(
    "product deleted",
    `product with productId: ${productId}`,
    uid,
  );
  return new RollingResponse("product deleted");
}
