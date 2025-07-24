import { Types } from 'mongoose';
import { z } from 'zod';

export const IdParamSchema = z.object({
  id: z.string().refine((val) => Types.ObjectId.isValid(val), { message: 'Invalid objectId' }),
});

export const IdParamSchemaWithPatchId = z.object({
  id: z.string().refine((val) => Types.ObjectId.isValid(val), { message: 'Invalid objectId' }),
  patchId: z.string().refine((val) => Types.ObjectId.isValid(val), { message: 'Invalid objectId' }),
});
