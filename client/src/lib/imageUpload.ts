export interface UploadUrl {
  uploadUrl: string;
  publicUrl: string;
}

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export function validateImageFile(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type as (typeof ACCEPTED_IMAGE_TYPES)[number])) {
    return 'Please choose a JPEG, PNG or WebP image.';
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return 'That image is larger than 5 MB. Please choose a smaller one.';
  }
  return null;
}

export async function putFileToS3(uploadUrl: string, file: File): Promise<void> {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  });
  if (!response.ok) {
    throw new Error('Upload failed. Please try again.');
  }
}
