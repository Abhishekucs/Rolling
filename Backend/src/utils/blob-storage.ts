import FirebaseAdmin from "../init/firebase-admin";
import {
  Bucket,
  GetSignedUrlConfig,
  GetSignedUrlResponse,
  GetFilesResponse,
} from "@google-cloud/storage";

const BASE_STORAGE_PATH = process.env.BASE_STORAGE_PATH ?? "productImage";

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

export async function renameImageFile(
  previousName: string,
  newName: string,
): Promise<Array<Record<string, string[]>>> {
  const moveOptions = {
    preconditionOpts: {
      ifGenerationMatch: 0,
    },
  };
  //   const deleteOptions = {
  //     ifGenerationMatch: 0,
  //   };
  const prefix = `${BASE_STORAGE_PATH}/${previousName}`;

  const [files] = await getFiles(prefix);

  const updatedUrls: Array<Record<string, string[]>> = [];

  await Promise.all(
    files.map(async (file) => {
      const fileName = file.name;
      const color = fileName.split("/")[2];
      const imageName = fileName.split("/")[3];

      const PREVIOUS_STORAGE_PATH = `${BASE_STORAGE_PATH}/${previousName}/${color}/${imageName}`;
      const NEW_STORAGE_PATH = `${BASE_STORAGE_PATH}/${newName}/${color}/${imageName}`;
      // Moves the file within the bucket
      await getStorageBucket()
        .file(PREVIOUS_STORAGE_PATH)
        .move(NEW_STORAGE_PATH, moveOptions);
      const [updatedUrl] = await generateSignedUrl(NEW_STORAGE_PATH);

      // Check if the updatedUrls array already contains a record with the same color
      const existingRecordIndex = updatedUrls.findIndex(
        (record) => record[color],
      );
      if (existingRecordIndex !== -1) {
        // If a record with the same color exists, add the updated URL to it
        updatedUrls[existingRecordIndex][color].push(updatedUrl);
      } else {
        // If no record with the same color exists, create a new record
        const record: Record<string, string[]> = {};
        record[color] = [updatedUrl];
        updatedUrls.push(record);
      }
    }),
  );

  return updatedUrls;
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

export async function getFiles(filePath: string): Promise<GetFilesResponse> {
  return await getStorageBucket().getFiles({
    prefix: filePath,
  });
}

export async function deleteFile(fileName: string): Promise<void> {
  await getStorageBucket().file(fileName).delete();
}
