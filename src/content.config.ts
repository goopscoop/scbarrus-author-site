import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const logs = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: 'src/content/logs' }),
  schema: z
    .object({
      title: z.string(),
      date: z.coerce.date(),
      summary: z.string().optional(),
      draft: z.boolean().default(false),
      image: z.string().optional(),
      imageAlt: z.string().optional(),
      tags: z.array(z.string()).optional(),
      /** When true, the entry is listed first on the logs index (still ordered by date among pinned and among unpinned). */
      pinned: z.boolean().optional().default(false),
    })
    .superRefine((data, ctx) => {
      if (data.image && !data.imageAlt) {
        ctx.addIssue({
          code: 'custom',
          message: 'imageAlt is required when image is set',
          path: ['imageAlt'],
        });
      }
    }),
});

export const collections = { logs };
