import { defineCollection, z } from 'astro:content';

const logs = defineCollection({
  type: 'content',
  schema: z
    .object({
      title: z.string(),
      /** ISO date string (YYYY-MM-DD) */
      date: z.coerce.date(),
      summary: z.string().optional(),
      draft: z.boolean().default(false),
      /** Public URL path under /public (e.g. /sketches/character-a.jpg) */
      image: z.string().optional(),
      imageAlt: z.string().optional(),
      tags: z.array(z.string()).optional(),
    })
    .superRefine((data, ctx) => {
      if (data.image && !data.imageAlt) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'imageAlt is required when image is set',
          path: ['imageAlt'],
        });
      }
    }),
});

export const collections = { logs };
