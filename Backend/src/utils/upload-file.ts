import FirebaseAdmin from "../init/firebase-admin";
import {
  Bucket,
  GetSignedUrlConfig,
  GetSignedUrlResponse,
} from "@google-cloud/storage";

const BASE_STORAGE_PATH = "productImage";

function getStorageBucket(): Bucket {
  return FirebaseAdmin().storage().bucket();
}

export async function uploadFile(
  color: string,
  name: string,
  images: Express.Multer.File[],
): Promise<Array<string>> {
  const bucketRef = getStorageBucket();
  const signedUrl: Array<string> = [];

  for (const image of images) {
    const STORAGE_PATH = `${BASE_STORAGE_PATH}/${name}/${color}/${image.originalname}`;
    await bucketRef.upload(image.path, {
      destination: STORAGE_PATH,
    });

    const [url] = await generateSignedUrl(STORAGE_PATH);
    signedUrl.push(url);
  }

  return signedUrl;
}

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
