import { RollingResponse } from "../utils/rolling-response";
import * as ProductDAL from "../dal/product";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import { uploadFile } from "../utils/upload-file";

export async function getAllProducts(
  req: RollingTypes.Request,
): Promise<RollingResponse> {
  const { category, filter, color, skip = 0, limit = 50 } = req.query;

  const queryLimit = Math.min(parseInt(limit as string, 10), 50);

  const products = await ProductDAL.getProducts(
    "getAllProducts",
    parseInt(skip as string, 10),
    queryLimit,
    category as string,
    filter as string,
    color as string,
  );

  return new RollingResponse("product retrieved", products);
}

export async function createNewProduct(
  req: RollingTypes.Request,
): Promise<RollingResponse> {
  const { category, name, description } = req.body;

  const product: RollingTypes.ProductWithoutVariants = {
    productId: uuidv4(),
    category,
    name,
    description,
    totalSKU: 0,
    tag: "new",
    createdAt: Date.now(),
    modifiedAt: Date.now(),
  };
  await ProductDAL.createProduct(product);

  return new RollingResponse("product created");
}

export async function createNewVariation(
  req: RollingTypes.Request,
): Promise<RollingResponse> {
  const productId = req.params["productId"];

  const product = await ProductDAL.findProductById(productId);

  const { color, colorPrice, sizes } = req.body;
  const images = req.files as Express.Multer.File[];

  let totalColorSKU = 0;
  _.forEach(sizes as RollingTypes.ProductVariantSize[], (size) => {
    const parsedSku = parseInt(size.sizeSKU as unknown as string, 10);
    totalColorSKU = totalColorSKU + parsedSku;
  });

  const signedUrl = await uploadFile(color, product.name, images);

  const productVariant: RollingTypes.ProductVariant = {
    variantId: uuidv4(),
    color,
    colorSKU: totalColorSKU,
    colorPrice: parseInt(colorPrice as string, 10),
    sizes,
    images: signedUrl,
  };

  await ProductDAL.createVariation(productVariant, productId);

  //update the totalsku in product
  const updatedTotalSku = product.totalSKU + totalColorSKU;

  await ProductDAL.updateTotalSkus(productId, updatedTotalSku);

  return new RollingResponse("variant created");
}
