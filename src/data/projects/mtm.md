---
title: MTM · DAMS
slug: mtm-dams
company: MTM Recognition
year: 2013
summary: Project hosted and managed all digital assets for our product offering with all of our platforms.
---

# MTM · DAMS

This project stands out to me for several reasons:
- It allowed me to mitigate some of the damange from my very first project with the company 😓
- It had conflicting requirements: Both a small internal user base and a large usage base.

## Goals
  - Project hosted and managed all digital assets for our product offering with all of our platforms. Each platform hosted hundreds of companies, each sending employees to redeem points or awards.
    - Generic products: glassware, golf clubs, gift cards...
    - Customer-specific items with customer supplied logos: plaques, trophies...
    - Generic items + Customer supplied logos: watches, golf clubs...
  - ~15 internal users, who would create and manage the assets
  - Several hundred customers and their employee base, who would see the assets.
  - Throughput, ~3-5 million requests per hour, during regular work hours M-F
## Technologies
  - AWS: 2-4 micro EC2 instances
    - Hosted a Node.JS application for internal users.
    - Rendered pre-sized thumbnails using ImageMagick via a shared mount to avoid network latency and reduce potential for downtime.
  - Node.JS
  - AngularJS 1
  - Bootstrap
  - MongoDB
## Accomplishments
  - Developed the internal application via an iterative Agile approach
  - Developed a simple caching process
    - Internal users would produce several thumbnails and gifs for a product
    - Once a thumbnail was approved, it was auto-assigned a revision code
    - Each generated thumbnail would be cached via a calculated path: Product ID + Revision Code [+ Customer ID]
        - This allowed common products to be reused across multiple customers
    - "Deploys" and "rollbacks" to sites using these assets would only need the new URLs
  - For EC2 instances, I developed a rolling deployment pattern to allow continuous deployments that did not require spinning up new servers with each deploy
## Problems
  Early into the launch, it became apparent that the servers were still rendering images well after the caching process. They did handle the load. But, it turned out that, at the time, AWS Cloudfront was ignoring our caching policy. AWS support informed me the load wasn't "serious enough" to cache longer than 24 hours. I pivoted to another caching provider that better fit our scale. This new provider honored the caching policy (of several weeks) and the server load dropped to expected levels.
