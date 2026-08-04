import { AwsClient } from "aws4fetch";
import type { Env } from "./types";

const PRESIGN_TTL_SECONDS = 15 * 60;

export type R2PresignConfig = {
  accessKeyId: string;
  secretAccessKey: string;
  accountId: string;
  bucketName: string;
};

export function readR2PresignConfig(env: Env): R2PresignConfig | null {
  const accessKeyId = env.R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = env.R2_SECRET_ACCESS_KEY?.trim();
  const accountId = env.R2_ACCOUNT_ID?.trim();
  const bucketName = env.R2_BUCKET_NAME?.trim();
  if (!accessKeyId || !secretAccessKey || !accountId || !bucketName) {
    return null;
  }
  return { accessKeyId, secretAccessKey, accountId, bucketName };
}

/**
 * Short-lived S3-compatible PUT URL for browser → R2 (bypasses CF Worker body limits).
 * Sign Content-Type so XHR Blob uploads (type application/octet-stream) match the signature.
 */
export async function createNoteFilePresignedPutUrl(
  config: R2PresignConfig,
  objectKey: string,
): Promise<{ uploadUrl: string; expiresIn: number }> {
  const client = new AwsClient({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    service: "s3",
    region: "auto",
  });
  const url = new URL(
    `https://${config.accountId}.r2.cloudflarestorage.com/${config.bucketName}/${objectKey}`,
  );
  url.searchParams.set("X-Amz-Expires", String(PRESIGN_TTL_SECONDS));
  const signed = await client.sign(
    new Request(url.toString(), {
      method: "PUT",
      headers: { "Content-Type": "application/octet-stream" },
    }),
    { aws: { signQuery: true } },
  );
  return { uploadUrl: signed.url, expiresIn: PRESIGN_TTL_SECONDS };
}
