import 'dotenv/config';
import path from 'node:path';
import fsp from 'node:fs/promises';
import { S3Client, type S3File } from 'bun';
import mime from 'mime';

export const upload = async () => {
  const client = new S3Client({
    bucket: process.env.SITE_BUCKET,
  });
  const files = await fetchFiles('./dist');

  console.log('uploading files...', files.length);

  await Promise.all((
    files.map(async filepath => {
      const s3File:S3File = client.file(filepath.replace(/^dist\//, ''));
      const buffer = await fsp.readFile(filepath);
      await s3File.write(buffer, {
        type: mime.getType(path.extname(filepath)) ?? 'text/plain',
      });
    })
  ));

  await uploadVersionLog(client);

  console.log('uploaded!');
};

const fetchFiles = async (dir: string) => {
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const list = await fsp.readdir(dir, {
    recursive: true,
  });

  const files: string[] = [];
  await Promise.all(list.map(async f => {
    if (/ds_store/i.test(f)) {
      return;
    }

    const file = path.join(dir, f);
    const stat = await fsp.stat(file);
    if (stat.isDirectory()) {
      return;
    }

    files.push(file);
  }));

  return files;
};

/**
 * Provide a way to verify host recently content was updated
 */
const uploadVersionLog = async (client: S3Client) => {
  const s3File: S3File = client.file("v")
  const buffer = Buffer.from((new Date().toString()));
  await s3File.write(buffer, {
    type: 'text/plain',
  });
}

export default upload;

(async () => {
  console.log('AWS: KEY :>> ', process.env.AWS_ACCESS_KEY_ID ? '✅' : '🚫');
  console.log('AWS: SECRET :>> ', process.env.AWS_SECRET_ACCESS_KEY ? '✅' : '🚫');
  console.log('AWS: SITE_BUCKET :>> ', process.env.SITE_BUCKET ? '✅' : '🚫');

  if (
    !process.env.AWS_ACCESS_KEY_ID
    || !process.env.AWS_SECRET_ACCESS_KEY
    || !process.env.SITE_BUCKET
  ) {
    throw new Error('missing required input');
  }

  await upload();
})();
