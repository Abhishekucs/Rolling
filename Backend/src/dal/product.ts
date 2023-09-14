import FirebaseAdmin from "../init/firebase-admin";
import RollingError from "../utils/error";
import { DocumentData } from "@google-cloud/firestore";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import { getOrder, sumAllRecordValue, updateRecordArray } from "../utils/misc";
import {
  deleteFile,
  getFiles,
  renameImageFile,
  uploadFile,
} from "../utils/blob-storage";

function getProductCollection(): FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData> {
  return FirebaseAdmin().firestore().collection("products");
}

function getVariantCollection(
  productId: string,
): FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData> {
  return FirebaseAdmin()
    .firestore()
    .collection("products")
    .doc(productId)
    .collection("variants");
}

type ProductResult = Omit<RollingTypes.Product, "variants">;

async function variantsToProducts(
  docs: FirebaseFirestore.QueryDocumentSnapshot<DocumentData>[],
  skip: number,
  limit: number,
  category?: string,
  stack?: string,
): Promise<RollingTypes.Product[]> {
  const products: RollingTypes.Product[] = [];
  for (const doc of docs) {
    const variantDoc = doc.data() as RollingTypes.ProductVariant;

    const parentDocRef = doc.ref.parent.parent;
    const parentDoc = await parentDocRef?.get();

    const parentData = parentDoc?.data() as RollingTypes.ProductWithoutVariants;

    const product: RollingTypes.Product = {
      ...parentData,
      variants: [variantDoc],
    };
    if (category === undefined || parentData.category === category) {
      products.push(product);
    }
  }

  const updatedProducts = skipAndLimit(skip, limit, products, stack);

  return updatedProducts;
}

function skipAndLimit(
  skip: number,
  limit: number,
  products: RollingTypes.Product[],
  stack?: string,
): RollingTypes.Product[] {
  if (skip > 0 && skip >= products.length) {
    throw new RollingError(404, "Product is empty", stack);
  }
  products = products.slice(skip > 0 ? skip : 0);

  if (limit > products.length) {
    limit = products.length;
  }

  products = products.slice(0, limit);

  return products;
}

export async function getProducts(
  stack: string,
  skip: number,
  limit: number,
  category?: string,
  filter?: string,
  color?: string,
): Promise<Array<RollingTypes.Product>> {
  try {
    const productCollectionRef = getProductCollection();
    const productQuery: FirebaseFirestore.Query<DocumentData> =
      productCollectionRef;
    let variantQuery: FirebaseFirestore.Query<DocumentData> = FirebaseAdmin()
      .firestore()
      .collectionGroup("variants");

    if (!(await productQuery.limit(1).get()).size) {
      throw new RollingError(404, "Product is empty", stack);
    }

    if (color) {
      variantQuery = variantQuery.where("color", "==", color);
    }

    if (filter) {
      if (filter === "expensive" || filter === "cheap") {
        variantQuery = variantQuery.orderBy("price", getOrder(filter));
      }

      if (filter === "new" || filter === "old" || filter == "instock") {
        if (filter == "instock") {
          variantQuery = variantQuery.where("colorSKU", ">", 0);
        } else {
          variantQuery = variantQuery.orderBy("modifiedAt", getOrder(filter));
        }
      }
    }

    const variantQuerySnapshot = await variantQuery.get();

    if (variantQuerySnapshot.empty) {
      throw new RollingError(404, "Product is empty", stack);
    }
    const variantDocs = variantQuerySnapshot.docs;
    const products = await variantsToProducts(
      variantDocs,
      skip,
      limit,
      category,
      stack,
    );

    if (products.length == 0) {
      throw new RollingError(404, "Product is empty", stack);
    }

    return products;
  } catch (e) {
    throw new RollingError(500, e.message);
  }
}

export async function createProduct(
  product: RollingTypes.ProductWithoutVariants,
): Promise<void> {
  const productCollectionRef = getProductCollection();
  await productCollectionRef.doc(product.productId).set(product);
}

export async function findProductById(
  productId: string,
): Promise<ProductResult> {
  const productCollectionRef = getProductCollection();
  const productDocRef = await productCollectionRef.doc(productId).get();
  if (!productDocRef.exists) {
    throw new RollingError(404, "Product does not exists");
  }

  const data = productDocRef.data();
  return data as ProductResult;
}

export async function getProductById(
  productId: string,
): Promise<RollingTypes.Product> {
  const productCollectionRef = getProductCollection();
  const productQuerySnapshot = await productCollectionRef.doc(productId).get();
  if (!productQuerySnapshot.exists) {
    throw new RollingError(404, "Product does not exists");
  }
  const productWithoutVariants =
    productQuerySnapshot.data() as RollingTypes.ProductWithoutVariants;

  const variantCollectionRef = getVariantCollection(productId);
  const variantQuerySnapshot = await variantCollectionRef.get();
  const variantDocs = variantQuerySnapshot.docs;
  const variants = variantDocs.map(
    (doc) => doc.data() as RollingTypes.ProductVariant,
  );

  const Product: RollingTypes.Product = {
    ...productWithoutVariants,
    variants,
  };
  return Product;
}

export async function createVariation(
  sizes: RollingTypes.ProductVariantSize,
  color: string,
  name: string,
  images: Express.Multer.File[],
  totalSKU: number,
  productId: string,
  price: number,
): Promise<void> {
  const updatedSizes = updateRecordArray(sizes, sizes);
  const totalColorSKU: number = sumAllRecordValue(updatedSizes);

  const signedUrl = await uploadFile(color, name, images);

  const productVariant: RollingTypes.ProductVariant = {
    variantId: uuidv4(),
    color,
    colorSKU: totalColorSKU,
    price: parseInt(price as unknown as string, 10),
    sizes: updatedSizes,
    images: signedUrl,
    createdAt: Date.now(),
    modifiedAt: Date.now(),
    tag: "new",
  };

  //update the totalsku in product
  const updatedTotalSku = totalSKU + totalColorSKU;

  await updateTotalSkus(productId, updatedTotalSku);

  const variantCollectionRef = getVariantCollection(productId);
  await variantCollectionRef.doc(productVariant.variantId).set(productVariant);
}

export async function updateTotalSkus(
  productId: string,
  totalSku: number,
): Promise<void> {
  const productCollectionRef = getProductCollection();
  await productCollectionRef.doc(productId).update({
    totalSKU: totalSku,
  });
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
    const variantCollectionRef = getVariantCollection(productId);
    const variantQuerySnapshot = await variantCollectionRef.get();
    const docs = variantQuerySnapshot.docs;

    for (const doc of docs) {
      const data = doc.data() as RollingTypes.ProductVariant;
      const color = data["color"];

      // Find the matching color in updatedImageUrl
      const matchingColorRecord = updatedImageUrl.find(
        (record) => record[color],
      );

      if (matchingColorRecord) {
        // Update the image field with the new image URL
        await doc.ref.update({
          images: matchingColorRecord[color],
          modifiedAt: Date.now(),
        });
      }
    }

    const productCollectionRef = getProductCollection();
    await productCollectionRef.doc(productId).update({
      name,
      description,
    });
  } catch (e) {
    throw new RollingError(500, e);
  }
}

export async function updateVariant(
  sizes: RollingTypes.ProductVariantSize | undefined,
  price: number | undefined,
  images: Express.Multer.File[] | undefined,
  variantId: string,
  productId: string,
): Promise<void> {
  try {
    const productDoc = (
      await getProductCollection().doc(productId).get()
    ).data() as RollingTypes.ProductWithoutVariants;
    const variantCollectionRef = getVariantCollection(productId);
    const variantDoc = (
      await variantCollectionRef.doc(variantId).get()
    ).data() as RollingTypes.ProductVariant;

    let signedUrl: string[] = variantDoc.images;
    let colorPrice: number = variantDoc.price;
    let totalColorSKU: number = variantDoc.colorSKU;
    let updatedSizes: RollingTypes.ProductVariantSize = variantDoc.sizes;

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

    if (price) {
      colorPrice = price;
    }

    if (sizes) {
      updatedSizes = updateRecordArray(variantDoc.sizes, sizes);
      const totalSizes = sumAllRecordValue(updatedSizes);
      totalColorSKU = parseInt(totalSizes as unknown as string, 10);
    }

    await getVariantCollection(productId).doc(variantId).update({
      images: signedUrl,
      price: colorPrice,
      colorSKU: totalColorSKU,
      sizes: updatedSizes,
      modifiedAt: Date.now(),
    });

    //update the totalsku in product
    const allVariantDocs = (await variantCollectionRef.get()).docs;
    let totalSku = 0;

    allVariantDocs.forEach((doc) => {
      const colorSku = doc.data()["colorSKU"];
      totalSku = totalSku + colorSku;
    });

    await updateTotalSkus(productId, totalSku);
  } catch (error) {
    throw new RollingError(500, error.message);
  }
}

export async function deleteProductById(productId: string): Promise<void> {
  //delete blob storage
  const productDoc = (
    await getProductCollection().doc(productId).get()
  ).data() as RollingTypes.ProductWithoutVariants;
  const variantDocs = (await getVariantCollection(productId).get()).docs;

  await Promise.all(
    variantDocs.map(async (doc) => {
      const data = doc.data() as RollingTypes.ProductVariant;
      const color = data.color;
      const name = productDoc.name;
      const filePath = `${process.env.BASE_STORAGE_PATH}/${name}/${color}`;
      const [files] = await getFiles(filePath);
      files.forEach(async (file) => {
        const imageName = file.name.split("/")[3];
        const updatedFilePath = `${filePath}/${imageName}`;
        await deleteFile(updatedFilePath);
      });

      //delete variant
      await getVariantCollection(productId).doc(data.variantId).delete();
    }),
  );

  // delete product collection
  await getProductCollection().doc(productId).delete();
}
