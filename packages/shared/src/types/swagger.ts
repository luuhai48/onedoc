import { z } from 'zod';

export const SwaggerEndpointResponseSchema = z.object({
  _id: z.coerce.string(),
  url: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type SwaggerEndpointResponse = z.infer<typeof SwaggerEndpointResponseSchema>;
