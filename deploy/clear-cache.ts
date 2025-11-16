import 'dotenv/config';
import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from '@aws-sdk/client-cloudfront';

/**
 * Invalidate the Cloudfront distribution cache after each deployment.
 * > Ensures updates are fresh and ready to be re-cached.
 */
export const clearCache = async () => {
  const client = new CloudFrontClient();
  await client.send(new CreateInvalidationCommand({
    DistributionId: process.env.SITE_CLOUDFRONT_DISTRIBUTION_ID,
    InvalidationBatch: {
      CallerReference: `web_deploy:${Date.now()}`,
      Paths: {
        Quantity: 1,
        Items: ['/*'],
      },
    },
  }));
  client.destroy();
  console.warn('clearing cache...');
};

export default clearCache;

(async () => {
  await clearCache();
})();
