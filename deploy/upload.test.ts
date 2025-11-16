import "dotenv/config";
import { S3Client, type S3File } from "bun";
import { test, expect } from "bun:test";

/*
Tests S3, ensures files can be uploaded to bucket
*/

test("upload", async () => {
  const client = new S3Client({
    bucket: process.env.SITE_BUCKET,
  });
  const filename = "test-file";

  let s3File: S3File = client.file(filename);
  const bufferUpload = Buffer.from(new Date().toString());
  await s3File.write(bufferUpload, {
    type: "text/plain",
  });

  // true most of the time, even if particular upload fails
  // s3File = client.file(filename);
  // const exists = await s3File.exists();
  // expect(exists, "not found").toBe(true);

  const string = await client.file(filename).text();
  expect(string).toStrictEqual(bufferUpload.toString());
});
