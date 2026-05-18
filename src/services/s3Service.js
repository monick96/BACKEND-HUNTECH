import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export async function generatePresignKey(key, contentType, expires = 900) {
  const cmd = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    ContentType: contentType,
    ACL: "private",
  });
  return getSignedUrl(s3, cmd, { expiresIn: expires }); // expires in seconds
}

export async function generatePresignedPutUrl({ Key, ContentType, expiresIn = 900 }) {
  const cmd = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET,
    Key,
    ContentType,
    ACL: "private",
  });
  const url = await getSignedUrl(s3, cmd, { expiresIn });
  return url;
}

export async function headObject({ Key }) {
  const cmd = new HeadObjectCommand({ Bucket: process.env.AWS_BUCKET, Key });
  return s3.send(cmd);
}
