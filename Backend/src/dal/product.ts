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

async function skipTo(
  query: FirebaseFirestore.Query<DocumentData>,
  skip: number,
  limit: number,
  orderBy: string,
  stack: string,
  orderByDirection?: OrderByDirection,
): Promise<FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>> {
  const querySnapshot = await query.orderBy(orderBy, orderByDirection).get();

  if (querySnapshot.empty) {
    throw new RollingError(404, "There is no product in this search", stack);
  }

  if (skip >= querySnapshot.docs.length) {
    throw new RollingError(404, "There is no product in this search", stack);
  } else {
    const updatedQuerySnapshotDocs = _.drop(querySnapshot.docs, skip);
    const last = updatedQuerySnapshotDocs[0];

    return await query
      .orderBy(orderBy, orderByDirection)
      .startAt(last.data()[orderBy])
      .limit(limit)
      .get();
  }
}

async function getProductsByColor(
  query: FirebaseFirestore.Query<DocumentData>,
  color: string,
  stack: string,
): Promise<RollingTypes.Product[]> {
  const queryDocRef = await query.get();

  const products = await Promise.all(
    _.map(queryDocRef.docs, async (doc) => {
      const id = doc.id;
      const querySnapshot = await getVariantCollection(id)
        .where("color", "==", color)
        .get();
      const docs = querySnapshot.docs;

      const variant = _.map(docs, (doc) => {
        return doc.data() as RollingTypes.ProductVariant;
      });

      const parentData = doc.data() as RollingTypes.ProductWithoutVariants;

      const product: RollingTypes.Product = {
        ...parentData,
        variants: variant,
      };

      return product;
    }),
  );

  const filteredProducts = products.filter(
    (product) => product?.variants?.length > 0,
  );

  if (filteredProducts.length > 0) {
    return filteredProducts;
  } else {
    throw new RollingError(404, "The Product is not in the search", stack);
  }
}

async function getProductsByCategoryAndSkip(
  query: FirebaseFirestore.Query<DocumentData>,
  category: string,
  skip: number,
  limit: number,
  stack: string,
): Promise<FirebaseFirestore.QuerySnapshot<DocumentData>> {
  const categoryQuery = query.where("category", "==", category);
  return await skipTo(categoryQuery, skip, limit, "productId", stack);
}

async function getProductsByColorAndSkip(
  color: string,
  skip: number,
  limit: number,
  stack: string,
): Promise<RollingTypes.Product[]> {
  const colorQuery = FirebaseAdmin()
    .firestore()
    .collectionGroup("variants")
    .where("color", "==", color);

  const variantsDocRef = await skipTo(
    colorQuery,
    skip,
    limit,
    "variantId",
    stack,
  );

  const variantsDocs = variantsDocRef.docs;

  const products: RollingTypes.Product[] = await Promise.all(
    _.map(variantsDocs, async (doc) => {
      const variantDoc = doc.data() as RollingTypes.ProductVariant;

      const parentDocRef = doc.ref.parent.parent;
      const parentDoc = await parentDocRef?.get();

      const parentData =
        parentDoc?.data() as RollingTypes.ProductWithoutVariants;

      const product: RollingTypes.Product = {
        ...parentData,
        variants: [variantDoc],
      };
      return product;
    }),
  );

  return products;
}

function getOrder(value: string): OrderByDirection {
  if (value === "expensive" || value === "new") {
    return "desc";
  } else {
    return "asc";
  }
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
    const productSnapshot = await productCollectionRef.get();

    if (productSnapshot.empty) {
      throw new RollingError(404, "Product is empty", stack);
    }

    const query: FirebaseFirestore.Query<DocumentData> = productCollectionRef;

    // skip is non zero and rest of the parameters are undefined
    let queryDocRef = await skipTo(query, skip, limit, "productId", stack);

    if (category !== undefined) {
      queryDocRef = await getProductsByCategoryAndSkip(
        query,
        category,
        skip,
        limit,
        stack,
      );
    }

    if (color !== undefined && category !== undefined) {
      const categoryQuery = query.where("category", "==", `${category}`);

      let products = await getProductsByColor(categoryQuery, color, stack);

      if (skip >= products.length) {
        throw new RollingError(404, "The Product is not in the search");
      } else if (skip > 0) {
        products = _.drop(products, skip);

        if (limit > 0 && limit <= products.length) {
          products = _.slice(products, 0, limit);
        } else if (limit > products.length) {
          limit = products.length;
          products = _.slice(products, 0, limit);
        }
      }

      if (limit > 0 && limit <= products.length) {
        products = _.slice(products, 0, limit);
      } else if (limit > products.length) {
        limit = products.length;
        products = _.slice(products, 0, limit);
      }

      return products;
    }

    if (filter !== undefined && color !== undefined && category !== undefined) {
      console.log("filter");
    }

    if (filter !== undefined && color !== undefined) {
      console.log("filter color");
    }

    if (color !== undefined) {
      return await getProductsByColorAndSkip(color, skip, limit, stack);
    }

    if (filter !== undefined) {
      if (filter === "expensive" || filter === "cheap") {
        const priceQuery = FirebaseAdmin()
          .firestore()
          .collectionGroup("variants");

        const variantsDocRef = await skipTo(
          priceQuery,
          skip,
          limit,
          "colorPrice",
          stack,
          getOrder(filter),
        );

        const variantsDocs = variantsDocRef.docs;

        const products: RollingTypes.Product[] = await Promise.all(
          _.map(variantsDocs, async (doc) => {
            const variantDoc = doc.data() as RollingTypes.ProductVariant;

            const parentDocRef = doc.ref.parent.parent;
            const parentDoc = await parentDocRef?.get();

            const parentData =
              parentDoc?.data() as RollingTypes.ProductWithoutVariants;

            const product: RollingTypes.Product = {
              ...parentData,
              variants: [variantDoc],
            };
            return product;
          }),
        );

        return products;
      }

      if (filter === "new" || filter === "old") {
        queryDocRef = await skipTo(
          query,
          skip,
          limit,
          "createdAt",
          stack,
          getOrder(filter),
        );
      }

      if (filter === "instock") {
        const newQuery = query.where("totalSKU", ">", 0);
        queryDocRef = await skipTo(newQuery, skip, limit, "totalSKU", stack);
      }
    }

    const productDocs = queryDocRef.docs;
    return Promise.all(
      _.map(productDocs, async (doc) => {
        const data = doc.data() as RollingTypes.ProductWithoutVariants;
        const variantCollectionRef = getVariantCollection(data.productId);

        const variantsDocRef = await variantCollectionRef.get();
        const variantsDocs = variantsDocRef.docs;

        const product: RollingTypes.Product = {
          ...data,
          variants: _.map(variantsDocs, (variant) => {
            const variantData = variant.data() as RollingTypes.ProductVariant;

            return variantData;
          }),
        };

        return product;
      }),
    );
  } catch (e) {
    console.log(e);
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
