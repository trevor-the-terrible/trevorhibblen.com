# trevorhibblen.com

A single static page. Everything served lives in `site/`; there is no build step.

## Run local
Requires [PDM](https://pdm-project.org/). `pdm dev` serves `site/` on http://localhost:4321 and reloads the browser when a file in `site/` changes.
```sh
pdm install
pdm dev
```

## Title font
`site/fonts/title.woff2` is [Inter](https://github.com/rsms/inter) pinned to weight 400 and subset to the characters in the `<h1>`. After changing that text, regenerate it from `Inter-VariableFont_opsz,wght.ttf` (requires `pip install fonttools brotli`):
```sh
fonttools varLib.instancer Inter-VariableFont_opsz,wght.ttf wght=400 -o inter-400.ttf
pyftsubset inter-400.ttf --text='<all h1 text>' --layout-features='*' --flavor=woff2 --output-file=site/fonts/title.woff2
```

## Backgrounds
The page only ever shows a small, heavily blurred region of each background animation, so `site/` keeps just that region. The sources are `site/light.gif` and `site/dark.gif` in commit `3d56bf4`. Regenerate with ffmpeg (built with libaom and libwebp):
```sh
ffmpeg -i light.gif -vf "crop=256:256,scale=128:128:flags=area,format=rgb24,setpts=N/(7.5*TB)" -r 7.5 -pix_fmt yuv444p -c:v libaom-av1 -crf 48 -b:v 0 -cpu-used 1 -g 999 site/light.avif
ffmpeg -i dark.gif -vf "crop=64:48:72:88,setpts=2*PTS" -fps_mode passthrough -c:v libwebp_anim -lossless 1 -loop 0 site/dark.webp
```
The crop sizes and offsets are tied to the `.background.light` and `.background.dark` rules in `site/index.html`; change them together.
Both animations play at half their original speed.

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
