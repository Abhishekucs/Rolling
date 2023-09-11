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

// async function getProductsByColor(
//   query: FirebaseFirestore.Query<DocumentData>,
//   color: string,
//   stack: string,
// ): Promise<RollingTypes.Product[]> {
//   const queryDocRef = await query.get();

//   const products = await Promise.all(
//     _.map(queryDocRef.docs, async (doc) => {
//       const id = doc.id;
//       const querySnapshot = await getVariantCollection(id)
//         .where("color", "==", color)
//         .get();
//       const docs = querySnapshot.docs;

//       const variant = _.map(docs, (doc) => {
//         return doc.data() as RollingTypes.ProductVariant;
//       });

//       const parentData = doc.data() as RollingTypes.ProductWithoutVariants;

//       const product: RollingTypes.Product = {
//         ...parentData,
//         variants: variant,
//       };

//       return product;
//     }),
//   );

//   const filteredProducts = products.filter(
//     (product) => product?.variants?.length > 0,
//   );

//   if (filteredProducts.length > 0) {
//     return filteredProducts;
//   } else {
//     throw new RollingError(404, "The Product is not in the search", stack);
//   }
// }

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
  query: FirebaseFirestore.Query<DocumentData>,
  skip: number,
  limit: number,
  stack: string,
): Promise<RollingTypes.Product[]> {
  const variantsDocRef = await skipTo(query, skip, limit, "variantId", stack);
  return await handleVariantProductResponse(variantsDocRef);
}

function getOrder(value: string): OrderByDirection {
  if (value === "expensive" || value === "new") {
    return "desc";
  } else {
    return "asc";
  }
}

async function handleProductResponse(
  docs: FirebaseFirestore.QueryDocumentSnapshot<DocumentData>[],
): Promise<RollingTypes.Product[]> {
  return await Promise.all(
    _.map(docs, async (doc) => {
      const data = doc?.data() as RollingTypes.ProductWithoutVariants;
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
}

async function handleVariantProductResponse(
  querySnapshot: FirebaseFirestore.QuerySnapshot<DocumentData>,
): Promise<RollingTypes.Product[]> {
  const docs = querySnapshot.docs;
  return await Promise.all(
    _.map(docs, async (doc) => {
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
    const variantQuery: FirebaseFirestore.Query<DocumentData> = FirebaseAdmin()
      .firestore()
      .collectionGroup("variants");

    let queryDocRef = await skipTo(query, skip, limit, "productId", stack);

    if (category !== undefined && color == undefined && filter == undefined) {
      queryDocRef = await getProductsByCategoryAndSkip(
        query,
        category,
        skip,
        limit,
        stack,
      );
    }

    if (color !== undefined && category !== undefined && filter == undefined) {
      const colorQuery = variantQuery.where("color", "==", `${color}`);
      const colorQuerySnapshot = await colorQuery.get();
      const colorDocs = colorQuerySnapshot.docs;

      const parentIds = _.map(colorDocs, (doc) => {
        const id = doc.ref.parent.parent?.id;
        return id;
      });

      const categoryQuery = query
        .where("category", "==", `${category}`)
        .where("productId", "in", parentIds);

      queryDocRef = await skipTo(
        categoryQuery,
        skip,
        limit,
        "productId",
        stack,
      );
    }

    if (filter && color && category !== undefined) {
      const colorQuery = variantQuery.where("color", "==", `${color}`);
      let querySnapshot = await colorQuery.get();
      if (querySnapshot.empty) {
        throw new RollingError(404, "The Product is not in the search", stack);
      }
      if (filter == "expensive" || filter == "cheap") {
        querySnapshot = await colorQuery
          .orderBy("colorPrice", getOrder(filter))
          .get();
      }
      const queryDocs = querySnapshot.docs;
      const filteredVariantQuerySnapshot = await Promise.all(
        _.map(queryDocs, async (doc) => {
          const parentDocSnapshot = await doc.ref.parent.parent?.get();
          const data = parentDocSnapshot?.data();
          if (data !== undefined) {
            const parentCategory = data["category"];
            if (parentCategory == category) {
              return doc;
            }
          }
        }),
      );
      const filteredVariants = filteredVariantQuerySnapshot.filter(
        (doc) => doc !== undefined,
      );

      if (filteredVariants.length == 0) {
        throw new RollingError(404, "The Product is not in the search", stack);
      }

      if (filteredVariants !== undefined) {
        let products = await Promise.all(
          _.map(filteredVariants, async (doc) => {
            const variantDoc = doc?.data() as RollingTypes.ProductVariant;
            const parentDocRef = doc?.ref.parent.parent;
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

        if (skip > 0 && skip >= products.length) {
          throw new RollingError(
            404,
            "The Product is not in the search",
            stack,
          );
        } else {
          products = _.drop(products, skip);
        }

        if (limit > products.length) {
          limit = products.length;
          products = _.slice(products, 0, limit);
        } else if (limit > 0) {
          products = _.slice(products, 0, limit);
        }

        return products;
      }

      //   const parentQuery = query
      //     .where("category", "==", `${category}`)
      //     .where("productId", "in", parentIds);
      //   const parentProductQuerySnapshot = await skipTo(
      //     parentQuery,
      //     skip,
      //     limit,
      //     "category",
      //     stack,
      //   );
      //   const parentProductDocs = parentProductQuerySnapshot.docs;
      //   const filteredParentIdsOrder = _.intersection(
      //     parentIds,
      //     parentProductDocs.map((item) => item.id),
      //   );
      //   const rearrangedDoc = _.orderBy(parentProductDocs, (item) =>
      //     _.indexOf(filteredParentIdsOrder, item.id),
      //   );
      //   return await handleProductResponse(rearrangedDoc);
    }

    if (filter !== undefined && color !== undefined && category == undefined) {
      const colorQuery = variantQuery.where("color", "==", `${color}`);

      if (filter == "expensive" || filter == "cheap") {
        const colorQuerySnapshot = await skipTo(
          colorQuery,
          skip,
          limit,
          "colorPrice",
          stack,
          getOrder(filter),
        );

        return await handleVariantProductResponse(colorQuerySnapshot);
      }

      if (filter == "new" || filter == "old" || filter == "instock") {
        const querySnapshot = await colorQuery.get();

        if (querySnapshot.empty) {
          throw new RollingError(404, "The Product is not in the search");
        }

        const colorDocs = querySnapshot.docs;

        const parentIds = _.map(colorDocs, (doc) => {
          const id = doc.ref.parent.parent?.id;
          return id;
        });

        const parentQuery = query.where("productId", "in", parentIds);

        let parentQuerySnapshot = await skipTo(
          parentQuery,
          skip,
          limit,
          "modifiedAt",
          stack,
          getOrder(filter),
        );

        if (filter == "instock") {
          const inStockQuery = parentQuery.where("totalSKU", ">", 0);
          parentQuerySnapshot = await skipTo(
            inStockQuery,
            skip,
            limit,
            "totalSKU",
            stack,
          );
        }

        const parentDocs = parentQuerySnapshot.docs;
        return await handleProductResponse(parentDocs);
      }
    }

    if (color !== undefined && filter == undefined && category == undefined) {
      const colorQuery = variantQuery.where("color", "==", `${color}`);
      return await getProductsByColorAndSkip(colorQuery, skip, limit, stack);
    }

    if (filter !== undefined && color === undefined && category === undefined) {
      if (filter === "expensive" || filter === "cheap") {
        const variantsDocRef = await skipTo(
          variantQuery,
          skip,
          limit,
          "colorPrice",
          stack,
          getOrder(filter),
        );
        return await handleVariantProductResponse(variantsDocRef);
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
    return await handleProductResponse(productDocs);
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
