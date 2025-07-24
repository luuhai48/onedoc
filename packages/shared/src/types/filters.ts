import { z } from 'zod';

export const PaginationFilterSchema = z.object({
  sort: z.string().default('_id').optional(),
  order: z.enum(['asc', 'desc']).default('desc').optional(),
  limit: z.coerce.number().default(10).optional(),
  page: z.coerce.number().default(1).optional(),
});

export type PaginationFilter = z.infer<typeof PaginationFilterSchema>;
