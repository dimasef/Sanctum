import { randomUUID } from 'node:crypto';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GraphQLError } from 'graphql';
import { config } from '../config.js';

const s3 = new S3Client({
  region: config.s3.region,
  credentials: {
    accessKeyId: config.s3.accessKeyId,
    secretAccessKey: config.s3.secretAccessKey,
  },
});

const EXTENSION_BY_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

async function createUploadUrl(
  keyPrefix: string,
  contentType: string,
): Promise<{ uploadUrl: string; publicUrl: string }> {
  const extension = EXTENSION_BY_TYPE[contentType];
  if (!extension) {
    throw new GraphQLError(`Unsupported content type: ${contentType}`, {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }

  const key = `${keyPrefix}/${randomUUID()}.${extension}`;
  const command = new PutObjectCommand({
    Bucket: config.s3.bucket,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });
  return { uploadUrl, publicUrl: `${config.s3.publicBaseUrl}/${key}` };
}

export const createAvatarUploadUrl = (userId: string, contentType: string) =>
  createUploadUrl(`avatars/${userId}`, contentType);

export const createCoverUploadUrl = (userId: string, bookId: string, contentType: string) =>
  createUploadUrl(`covers/${userId}/${bookId}`, contentType);

export async function deleteByPublicUrl(publicUrl: string): Promise<void> {
  const prefix = `${config.s3.publicBaseUrl}/`;
  if (!publicUrl.startsWith(prefix)) return;
  const key = publicUrl.slice(prefix.length);
  await s3.send(new DeleteObjectCommand({ Bucket: config.s3.bucket, Key: key }));
}
