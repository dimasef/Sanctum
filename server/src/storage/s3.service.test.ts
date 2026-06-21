import { describe, it, expect, vi, beforeEach } from 'vitest';

const { sendMock, getSignedUrlMock } = vi.hoisted(() => ({
  sendMock: vi.fn(),
  getSignedUrlMock: vi.fn(),
}));

vi.mock('@aws-sdk/client-s3', () => ({
  S3Client: vi.fn(function () {
    return { send: sendMock };
  }),
  PutObjectCommand: vi.fn(function (input: unknown) {
    return { input };
  }),
  DeleteObjectCommand: vi.fn(function (input: unknown) {
    return { input };
  }),
}));

vi.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: getSignedUrlMock,
}));

import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { createAvatarUploadUrl, createCoverUploadUrl, deleteByPublicUrl } from './s3.service.js';

const BASE = 'https://test-bucket.s3.eu-central-1.amazonaws.com';

beforeEach(() => {
  vi.clearAllMocks();
  getSignedUrlMock.mockResolvedValue('https://signed.example/put');
  sendMock.mockResolvedValue({});
});

describe('createAvatarUploadUrl', () => {
  it('rejects an unsupported content type with BAD_USER_INPUT', async () => {
    await expect(createAvatarUploadUrl('user-1', 'application/pdf')).rejects.toMatchObject({
      extensions: { code: 'BAD_USER_INPUT' },
    });
    expect(getSignedUrlMock).not.toHaveBeenCalled();
  });

  it('returns the signed url and an avatars/{userId} public url for a valid type', async () => {
    const { uploadUrl, publicUrl } = await createAvatarUploadUrl('user-1', 'image/png');
    expect(uploadUrl).toBe('https://signed.example/put');
    expect(publicUrl).toMatch(new RegExp(`^${BASE}/avatars/user-1/[0-9a-f-]+\\.png$`));
  });
});

describe('createCoverUploadUrl', () => {
  it('builds a covers/{userId}/{bookId} public url', async () => {
    const { publicUrl } = await createCoverUploadUrl('user-1', 'book-1', 'image/webp');
    expect(publicUrl).toMatch(new RegExp(`^${BASE}/covers/user-1/book-1/[0-9a-f-]+\\.webp$`));
  });
});

describe('deleteByPublicUrl', () => {
  it('deletes an object that lives in our bucket, stripping the base url to the key', async () => {
    await deleteByPublicUrl(`${BASE}/avatars/user-1/abc.png`);
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(DeleteObjectCommand).toHaveBeenCalledWith(
      expect.objectContaining({ Key: 'avatars/user-1/abc.png' }),
    );
  });

  it('ignores a url that is not in our bucket and never calls S3', async () => {
    await deleteByPublicUrl('https://books.google.com/cover.jpg');
    expect(sendMock).not.toHaveBeenCalled();
  });
});
