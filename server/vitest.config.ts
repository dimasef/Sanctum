import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    env: {
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test?schema=public',
      GOOGLE_BOOKS_API_KEY: 'test-google-key',
      JWT_ACCESS_SECRET: 'test-access-secret',
      JWT_REFRESH_SECRET: 'test-refresh-secret',
      AWS_REGION: 'eu-central-1',
      AWS_S3_BUCKET: 'test-bucket',
      AWS_ACCESS_KEY_ID: 'test-access-key-id',
      AWS_SECRET_ACCESS_KEY: 'test-secret-access-key',
      AWS_S3_PUBLIC_BASE_URL: 'https://test-bucket.s3.eu-central-1.amazonaws.com',
    },
  },
});
