import { RollingResponse } from "../utils/rolling-response";
import * as ProductDAL from "../dal/product";

export async function getAllProducts(
  req: RollingTypes.Request,
): Promise<RollingResponse> {
  const {
    category,
    pricetag,
    color,
    skip,
    limit = 50,
    instock,
    tag,
  } = req.query;

  const queryLimit = Math.min(parseInt(limit as string, 10), 50);

  const products = await ProductDAL.getAllProduct(
    {
      category: category as string,
      pricetag: pricetag as string,
      color: color as string,
      skip: parseInt(skip as string, 10),
      limit: queryLimit,
      instock: instock as unknown as boolean,
      tag: tag as string,
    },
    "getAllProducts",
  );

  return new RollingResponse("product retrieved", products);
}

export async function createNewProduct(
  req: RollingTypes.Request,
): Promise<RollingResponse> {
  //   const { uid } = req.ctx.decodedToken;

  //   const {
  //     category,
  //     name,
  //     price,
  //     tag,
  //     priceTag,
  //     inStock,
  //     color,
  //     size,
  //     description,
  //   } = req.body;
  const images = req.files;

  // upload the images to a blob storage and get the url
  const signedUrl = await ProductDAL.uploadFile(
    images as Express.Multer.File[],
  );

  return new RollingResponse("image uploaded", signedUrl);
}
