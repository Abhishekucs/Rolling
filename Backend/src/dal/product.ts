import FirebaseAdmin from "../init/firebase-admin";
import RollingError from "../utils/error";
import { DocumentData } from "@google-cloud/firestore";

import _ from "lodash";

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
type OrderByDirection = "asc" | "desc";

function getOrder(value: string): OrderByDirection {
  if (value === "expensive" || value === "new") {
    return "desc";
  } else {
    return "asc";
  }
}

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
    //const productSnapshot = await productCollectionRef.get();

    // if (productSnapshot.empty) {
    //   throw new RollingError(404, "Product is empty", stack);
    // }
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

export async function createVariation(
  variant: RollingTypes.ProductVariant,
  productId: string,
): Promise<void> {
  const variantCollectionRef = getVariantCollection(productId);
  await variantCollectionRef.doc(variant.variantId).set(variant);
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
