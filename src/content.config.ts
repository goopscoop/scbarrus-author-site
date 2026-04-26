import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const logs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/logs' }),
  schema: z
    .object({
      title: z.string(),
      date: z.coerce.date(),
      summary: z.string().optional(),
      draft: z.boolean().default(false),
      image: z.string().optional(),
      imageAlt: z.string().optional(),
      tags: z.array(z.string()).optional(),
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
