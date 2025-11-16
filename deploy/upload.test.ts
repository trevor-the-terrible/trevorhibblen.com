import 'dotenv/config';
import { S3Client, type S3File } from 'bun';
import { test, expect } from 'bun:test'

test('upload', async () => {
  const client = new S3Client({
    bucket: process.env.SITE_BUCKET,
  });

  const s3File: S3File = client.file("test-file")
  const buffer = Buffer.from((new Date().toString()));
  await s3File.write(buffer, {
    type: 'text/plain',
  });

  const exists = await s3File.exists();
  expect(exists, 'not found').toBe(true)
});
