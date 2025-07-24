import { Types } from 'mongoose';
import { z } from 'zod';

export const PaginationFilterSchema = z.object({
  sort: z.string().default('_id').optional(),
  order: z.enum(['asc', 'desc']).default('desc').optional(),
  afterId: z
    .string()
    .refine((val) => Types.ObjectId.isValid(val), { message: 'Invalid objectId' })
    .optional(),
  beforeId: z
    .string()
    .refine((val) => Types.ObjectId.isValid(val), { message: 'Invalid objectId' })
    .optional(),
});

export type PaginationFilter = z.infer<typeof PaginationFilterSchema>;
