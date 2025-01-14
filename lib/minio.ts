import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

if (!process.env.MINIO_ENDPOINT) {
  throw new Error("Missing MINIO_ENDPOINT");
}

if (!process.env.MINIO_ACCESS_KEY) {
  throw new Error("Missing MINIO_ACCESS_KEY");
}

if (!process.env.MINIO_SECRET_KEY) {
  throw new Error("Missing MINIO_SECRET_KEY");
}

if (!process.env.MINIO_BUCKET_NAME) {
  throw new Error("Missing MINIO_BUCKET_NAME");
}

export const s3Client = new S3Client({
  endpoint: process.env.MINIO_ENDPOINT,
  region: "us-east-1", // MinIO requires a region, but it can be any value
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY,
    secretAccessKey: process.env.MINIO_SECRET_KEY,
  },
  forcePathStyle: true, // Required for MinIO
  tls: process.env.MINIO_USE_SSL === "true",
});

export const BUCKET_NAME = process.env.MINIO_BUCKET_NAME;

export function getKeyFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    // Remove the leading slash if it exists
    const path = urlObj.pathname.startsWith('/') ? urlObj.pathname.slice(1) : urlObj.pathname;
    // Remove bucket name from the path if it's included
    const parts = path.split('/');
    if (parts[0] === BUCKET_NAME) {
      return parts.slice(1).join('/');
    }
    return path;
  } catch (error) {
    console.error("Error parsing image URL:", error);
    return null;
  }
}

export async function deleteImage(url: string): Promise<boolean> {
  try {
    const key = getKeyFromUrl(url);
    if (!key) return false;

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      })
    );
    return true;
  } catch (error) {
    console.error("Error deleting image:", error);
    return false;
  }
}