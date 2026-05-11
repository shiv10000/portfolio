import {
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';
import {randomUUID} from 'node:crypto';
import path from 'node:path';

const UPLOAD_PREFIX = 'portfolio-videos';
const SIGNED_UPLOAD_EXPIRES_SECONDS = 10 * 60;

export type AwsUploadTicket = {
  objectKey: string;
  bucket: string;
  uploadUrl: string;
  videoUrl: string;
};

let s3Client: S3Client | null = null;

export function hasAwsStorageConfig() {
  return Boolean(
    process.env.AWS_REGION &&
      process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY &&
      process.env.AWS_S3_BUCKET &&
      process.env.AWS_CLOUDFRONT_DOMAIN,
  );
}

function getAwsBucket() {
  const bucket = process.env.AWS_S3_BUCKET;
  if (!bucket) {
    throw new Error('AWS_S3_BUCKET is missing');
  }

  return bucket;
}

function getCloudFrontDomain() {
  const domain = process.env.AWS_CLOUDFRONT_DOMAIN;
  if (!domain) {
    throw new Error('AWS_CLOUDFRONT_DOMAIN is missing');
  }

  return domain.replace(/\/+$/, '');
}

function getS3Client() {
  if (s3Client) return s3Client;

  const region = process.env.AWS_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!region || !accessKeyId || !secretAccessKey) {
    throw new Error('AWS S3 env vars are missing');
  }

  s3Client = new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  return s3Client;
}

function safeObjectKey(fileName: string) {
  const extension = path.extname(fileName).toLowerCase() || '.mp4';
  const baseName = path
    .basename(fileName, extension)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70);
  const date = new Date();
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');

  return `${UPLOAD_PREFIX}/${year}/${month}/${baseName || 'video'}-${randomUUID()}${extension}`;
}

function encodeObjectKey(objectKey: string) {
  return objectKey.split('/').map(encodeURIComponent).join('/');
}

export function getPublicVideoUrl(objectKey: string) {
  return `${getCloudFrontDomain()}/${encodeObjectKey(objectKey)}`;
}

export async function createAwsVideoUploadTicket({
  fileName,
  contentType,
}: {
  fileName: string;
  contentType: string;
}): Promise<AwsUploadTicket> {
  const bucket = getAwsBucket();
  const objectKey = safeObjectKey(fileName);
  const videoContentType = contentType || 'video/mp4';

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: objectKey,
    ContentType: videoContentType,
    CacheControl: 'public, max-age=31536000, immutable',
    Metadata: {
      originalFileName: fileName.slice(0, 250),
    },
  });

  const uploadUrl = await getSignedUrl(getS3Client(), command, {
    expiresIn: SIGNED_UPLOAD_EXPIRES_SECONDS,
  });

  return {
    objectKey,
    bucket,
    uploadUrl,
    videoUrl: getPublicVideoUrl(objectKey),
  };
}

export async function assertAwsObjectExists(objectKey: string) {
  const bucket = getAwsBucket();

  if (!objectKey.startsWith(`${UPLOAD_PREFIX}/`)) {
    throw new Error('Invalid S3 object key');
  }

  await getS3Client().send(
    new HeadObjectCommand({
      Bucket: bucket,
      Key: objectKey,
    }),
  );
}

export async function deleteAwsObject(objectKey: string) {
  const bucket = getAwsBucket();

  if (!objectKey.startsWith(`${UPLOAD_PREFIX}/`)) {
    throw new Error('Invalid S3 object key');
  }

  await getS3Client().send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: objectKey,
    }),
  );
}
