import RollingError from "../utils/error";
import _ from "lodash";
import { sumAllObjectValue } from "../utils/misc";
import {
  deleteFile,
  getFiles,
  renameImageFile,
  uploadFile,
} from "../utils/blob-storage";
import * as db from "../init/db";
import { Collection, Document, ObjectId } from "mongodb";

function getProductCollection(): Collection<RollingTypes.Product> {
  return db.collection<RollingTypes.Product>("products");
}

export async function getProducts(
  stack: string,
  opts: RollingTypes.ProductFilterOption,
): Promise<Document[]> {
  const { category, sortBy, skip, limit, color } = opts;

  try {
    const products = await getProductCollection()
      .aggregate([
        {
          $match: {
            ...(!_.isNil(category) && { category }),
          },
        },
        {
          $match: {
            ...(!_.isNil(sortBy) &&
              sortBy === "instock" && { totalSKU: { $gt: 0 } }),
          },
        },
        {
          $unwind: "$variants",
        },
        {
          $match: {
            ...(!_.isNil(color) && { "variants.color": color }),
          },
        },

        {
          $project: {
            _id: 1,
            category: 1,
            name: 1,
            description: 1,
            createdAt: 1,
            modifiedAt: 1,
            totalSKU: 1,
            "variants._id": 1,
            "variants.color": 1,
            "variants.price": 1,
            "variants.sizes": 1,
            "variants.images": 1,
            "variants.createdAt": 1,
            "variants.modifiedAt": 1,
          },
        },
      ])
      .sort({
        ...(!_.isNil(sortBy) &&
          sortBy === "expensive" && {
            "variants.price": -1,
          }),
        ...(!_.isNil(sortBy) &&
          sortBy === "cheap" && {
            "variants.price": 1,
          }),
        ...(!_.isNil(sortBy) &&
          sortBy === "new" && {
            "variants.modifiedAt": -1,
          }),
        ...(!_.isNil(sortBy) &&
          sortBy === "old" && {
            "variants.modifiedAt": 1,
          }),
        createdAt: -1,
      })
      .skip(skip ?? 0)
      .limit(limit ?? 50)
      .toArray();

    return products;
  } catch (e) {
    throw new RollingError(500, e.message);
  }
}

export async function createProduct(
  product: RollingTypes.Product,
): Promise<{ insertedId: ObjectId }> {
  const result = await getProductCollection().insertOne(product);

  return { insertedId: result.insertedId };
}

export async function getProductById(
  productId: string,
): Promise<RollingTypes.Product> {
  const product = await getProductCollection().findOne({
    _id: new ObjectId(productId),
  });
  if (!product) {
    throw new RollingError(404, "Product does not exists");
  }
  return product;
}

export async function createVariation(
  sizes: RollingTypes.ProductVariantSize,
  color: string,
  name: string,
  images: Express.Multer.File[],
  totalSKU: number,
  price: number,
  productId: string,
): Promise<{ variantId: ObjectId }> {
  const totalColorSKU = sumAllObjectValue(sizes);

  const signedUrl = await uploadFile(color, name, images);

  const productVariant: RollingTypes.ProductVariant = {
    _id: new ObjectId(),
    color,
    colorSKU: totalColorSKU,
    price: parseInt(price as unknown as string, 10),
    sizes: sizes,
    images: signedUrl,
    createdAt: Date.now(),
    modifiedAt: Date.now(),
    tag: "new",
  };

  //update the totalsku in product
  const updatedTotalSku = totalSKU + totalColorSKU;

  await getProductCollection().updateOne(
    { _id: new ObjectId(productId) },
    {
      $set: { totalSKU: updatedTotalSku },
      $push: { variants: productVariant },
    },
  );

  return { variantId: productVariant._id };
}

export async function updateProduct(
  name: string,
  previousName: string,
  description: Array<string>,
  productId: string,
): Promise<void> {
  if (name === previousName) {
    throw new RollingError(403, "New Name is same as the old name");
  }

  try {
    const updatedImageUrl = await renameImageFile(previousName, name);

    const product = await getProductById(productId);
    const variants = product.variants;

    const updatedVariants = _.map(variants, (variant) => {
      const color = variant.color;
      const matchingColorRecord = updatedImageUrl.find(
        (record) => record[color],
      );

      if (matchingColorRecord) {
        variant.images = matchingColorRecord[color];
        variant.modifiedAt = Date.now();
      }

      return variant;
    });

    await getProductCollection().updateOne(
      { _id: new ObjectId(productId) },
      {
        $set: {
          name,
          description,
          variants: updatedVariants,
        },
      },
    );
  } catch (e) {
    throw new RollingError(500, e);
  }
}

export async function updateVariant(
  sizes: RollingTypes.ProductVariantSize,
  price: number,
  images: Express.Multer.File[],
  variantId: string,
  productId: string,
): Promise<void> {
  try {
    const productDoc = await getProductCollection().findOne({
      _id: new ObjectId(productId),
    });

    if (!productDoc) {
      throw new RollingError(404, "Product not found", "updateVariant");
    }
    const variantIndex = _.findIndex(productDoc.variants, {
      _id: new ObjectId(variantId),
    });

    if (variantIndex === -1) {
      throw new RollingError(404, "Variant not found", "updateVariant");
    }

    const variantDoc = productDoc.variants[variantIndex];

    let signedUrl: string[] = variantDoc.images;
    let colorPrice: number = variantDoc.price;
    let totalColorSKU: number = variantDoc.colorSKU;

    if (images && !_.isEmpty(images)) {
      const color = variantDoc.color;
      const name = productDoc.name;
      const filePath = `${process.env.BASE_STORAGE_PATH}/${name}/${color}`;
      const [files] = await getFiles(filePath);
      await Promise.all(
        files.map(async (file) => {
          const imageName = file.name.split("/")[3];
          const updatedFilePath = `${filePath}/${imageName}`;
          await deleteFile(updatedFilePath);
        }),
      );

      signedUrl = await uploadFile(color, name, images);
    }

    colorPrice = price;
    totalColorSKU = sumAllObjectValue(sizes);

    productDoc.variants[variantIndex] = {
      ...variantDoc,
      price: colorPrice,
      images: signedUrl,
      colorSKU: totalColorSKU,
      sizes,
      modifiedAt: Date.now(),
    };

    let totalSku = 0;

    productDoc.variants.forEach((doc) => {
      const colorSku = doc.colorSKU;
      totalSku = totalSku + colorSku;
    });

    const updatedProductDoc: RollingTypes.Product = {
      ...productDoc,
      totalSKU: totalSku,
      modifiedAt: Date.now(),
    };

    await getProductCollection().updateOne(
      { _id: new ObjectId(productId) },
      { $set: updatedProductDoc },
    );
  } catch (error) {
    throw new RollingError(500, error.message);
  }
}

export async function deleteProductById(productId: string): Promise<void> {
  //delete blob storage
  const productDoc = await getProductCollection().findOne({
    _id: new ObjectId(productId),
  });

  if (!productDoc) {
    throw new RollingError(404, "Product not found", "deleteProductById");
  }

  const variantDocs = productDoc.variants;

  await Promise.all(
    variantDocs.map(async (doc) => {
      const color = doc.color;
      const name = productDoc.name;
      const filePath = `${process.env.BASE_STORAGE_PATH}/${name}/${color}`;
      const [files] = await getFiles(filePath);
      files.forEach(async (file) => {
        const imageName = file.name.split("/")[3];
        const updatedFilePath = `${filePath}/${imageName}`;
        await deleteFile(updatedFilePath);
      });
    }),
  );

  // delete product collection
  await getProductCollection().deleteOne({ _id: new ObjectId(productId) });
}
