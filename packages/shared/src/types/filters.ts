import { z } from 'zod';

export const PaginationFilterSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sort: z.string().default('_id'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export type PaginationFilter = z.infer<typeof PaginationFilterSchema>;
