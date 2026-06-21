import { describe, it, expect } from 'vitest';
import { MAX_IMAGE_BYTES, validateImageFile } from './imageUpload.ts';

function fileOf(type: string, size: number): File {
  return new File([new Uint8Array(size)], 'image', { type });
}

describe('validateImageFile', () => {
  it('accepts a small jpeg/png/webp', () => {
    expect(validateImageFile(fileOf('image/jpeg', 1024))).toBeNull();
    expect(validateImageFile(fileOf('image/png', 1024))).toBeNull();
    expect(validateImageFile(fileOf('image/webp', 1024))).toBeNull();
  });

  it('rejects an unsupported type', () => {
    expect(validateImageFile(fileOf('application/pdf', 1024))).toMatch(/JPEG, PNG or WebP/);
    expect(validateImageFile(fileOf('image/gif', 1024))).toMatch(/JPEG, PNG or WebP/);
  });

  it('rejects a file larger than the size limit', () => {
    expect(validateImageFile(fileOf('image/png', MAX_IMAGE_BYTES + 1))).toMatch(/5 MB/);
  });
});
