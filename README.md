# trevorhibblen.com

## Install
```bash
bun ci
```

## Run local
```bash
bun dev
```

## Tests
> Builds the production version of the site, but doesn't upload it to S3 or clear the CloudFront cache
```bash
bun test
```

## E2E Tests
> Builds the production version of the site, but doesn't upload it to S3 or clear the CloudFront cache
```bash
bun cy:test
```

## Preview build
> Builds the production version of the site, but doesn't upload it to S3 or clear the CloudFront cache
```bash
bun preview
```

## Deploy
> Builds the production version of the site, uploads it to S3 and clears the CloudFront cache

Required environment variables
  - SITE_BUCKET
  - SITE_CLOUDFRONT_DISTRIBUTION_ID
  - AWS_ACCESS_KEY_ID
  - AWS_SECRET_ACCESS_KEY

```bash
bun pub
```

## clear CloudFront cache, otherwise  you probably won't see the changes
> This is automatically run during deploy

Required environment variables
  - SITE_CLOUDFRONT_DISTRIBUTION_ID
  - AWS_ACCESS_KEY_ID
  - AWS_SECRET_ACCESS_KEY

```bash
bun clearcache
```

## TODO
- [ ] Add projects portfolio
- [ ] Add a 404 page
