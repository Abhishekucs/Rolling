import FirebaseAdmin from "../init/firebase-admin";
import RollingError from "../utils/error";
import {
  Bucket,
  GetSignedUrlConfig,
  GetSignedUrlResponse,
} from "@google-cloud/storage";
import _ from "lodash";

function getProductCollection(): FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData> {
  return FirebaseAdmin().firestore().collection("products");
}

function getStorageBucket(): Bucket {
  return FirebaseAdmin().storage().bucket();
}

const BASE_STORAGE_PATH = "productImage";

async function generateSignedUrl(
  filename: string,
): Promise<GetSignedUrlResponse> {
  const bucketRef = getStorageBucket();

  const options: GetSignedUrlConfig = {
    version: "v4",
    action: "read",
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  };
  const url = await bucketRef.file(filename).getSignedUrl(options);

  return url;
}

export async function uploadFile(
  images: Express.Multer.File[],
): Promise<Array<string>> {
  const bucketRef = getStorageBucket();
  const signedUrl: Array<string> = [];

  for (const image of images) {
    const STORAGE_PATH = `${BASE_STORAGE_PATH}/${image.filename}`;
    await bucketRef.upload(image.path, {
      destination: STORAGE_PATH,
    });

    const [url] = await generateSignedUrl(STORAGE_PATH);
    signedUrl.push(url);
  }

  return signedUrl;
}

export async function getAllProduct(
  productQuery: RollingTypes.ProductQuery,
  stack: string,
): Promise<Array<RollingTypes.Product>> {
  const productCollectionRef = getProductCollection();
  const productSnapshot = await productCollectionRef.get();

  if (productSnapshot.empty) {
    throw new RollingError(404, "Product is empty", stack);
  }

  if (productQuery.limit > 50 || productQuery.limit < 0) {
    productQuery.limit = 50;
  }
  if (productQuery.skip < 0) {
    productQuery.skip = 0;
  }

  const queryDoc = await productCollectionRef
    .where("color", "==", `${productQuery.color}`)
    .where("category", "==", `${productQuery.category}`)
    .orderBy(`${productQuery.instock}`)
    .orderBy(`${productQuery.pricetag}`)
    .orderBy(`${productQuery.tag}`)
    .startAfter(productQuery.skip)
    .limit(productQuery.limit)
    .get();

  if (queryDoc.empty) {
    throw new RollingError(404, "There is no product in this search", stack);
  }

  const productDocs = queryDoc.docs;
  return _.map(productDocs, (doc) => {
    return doc.data() as RollingTypes.Product;
  });
}
