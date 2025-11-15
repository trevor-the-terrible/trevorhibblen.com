import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const workhistory = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/data/work-history',
  }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    role: z.string(),
    company: z.string(),
    location: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    sortOrder: z.number(),
  }),
});

const projects = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/data/projects',
  }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    year: z.number(),
    company: z.string(),
    summary: z.string(),
  }),
});


// 4. Export a single `collections` object to register your collection(s)
export const collections = {
  workhistory,
  projects,
};
