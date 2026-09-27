# trevorhibblen.com

A single static page. Everything served lives in `site/`; there is no build step.

## Run local
Serves `site/` on http://localhost:4321 and reloads the browser when a file in `site/` changes.
```sh
python3 -m venv .venv
.venv/bin/pip install -r requirements-dev.txt
.venv/bin/livereload site -p 4321
```

## Title font
`site/fonts/title.woff2` is [Inter](https://github.com/rsms/inter) pinned to weight 400 and subset to the characters in the `<h1>`. After changing that text, regenerate it from `Inter-VariableFont_opsz,wght.ttf` (requires `pip install fonttools brotli`):
```sh
fonttools varLib.instancer Inter-VariableFont_opsz,wght.ttf wght=400 -o inter-400.ttf
pyftsubset inter-400.ttf --text='<all h1 text>' --layout-features='*' --flavor=woff2 --output-file=site/fonts/title.woff2
```

## Deploy
Pushing to `main` runs `.github/workflows/default-release.yml`, which syncs `site/` to S3 and invalidates the CloudFront cache.

Required secrets
  - SITE_BUCKET
  - SITE_CLOUDFRONT_DISTRIBUTION_ID
  - AWS_REGION
  - AWS_ACCESS_KEY_ID
  - AWS_SECRET_ACCESS_KEY

Manual deploy with the same variables exported:
```sh
aws s3 sync site "s3://$SITE_BUCKET"
aws cloudfront create-invalidation --distribution-id "$SITE_CLOUDFRONT_DISTRIBUTION_ID" --paths "/*"
```
