# trevorhibblen.com

## Install & Run local
> npm/pnpm can install and run the project.
```sh
npm ci; # pnpm run ci
npm run dev; # pnpm dev
```

> [Bun](https://bun.com/) is required to run tests and all other scripts

## Tests
```sh
bun test;
bun cy:test;
```

## Preview build
> Preview production version of site
```sh
bun preview;
```

## Deploy
> Builds the production version, uploads it to S3 and clears the CloudFront cache

Required environment variables
  - SITE_BUCKET
  - SITE_CLOUDFRONT_DISTRIBUTION_ID
  - AWS_ACCESS_KEY_ID
  - AWS_SECRET_ACCESS_KEY

```bash
bun pub;
```

## TODO
- [ ] Automate deployment via github
- [ ] Add projects portfolio
- [ ] Add a 404 page
