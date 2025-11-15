import 'dotenv/config';
import path from 'node:path';
import fsp from 'node:fs/promises';
import { S3Client, type S3File } from 'bun';
import mime from 'mime';

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

  console.log('uploaded!');
};

export default upload;

(async () => {
  console.log('!!process.env.ID :>> ', !!process.env.AWS_ACCESS_KEY_ID);
  console.log('!!process.env.KEY :>> ', !!process.env.AWS_SECRET_ACCESS_KEY);
  console.log('!!process.env.SITE_BUCKET :>> ', !!process.env.SITE_BUCKET);

  if (
    !process.env.AWS_ACCESS_KEY_ID
    || !process.env.AWS_SECRET_ACCESS_KEY
    || !process.env.SITE_BUCKET
  ) {
    throw new Error('missing required input');
  }

  await upload();
})();
