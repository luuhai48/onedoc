import { z } from 'zod';

export const SwaggerEndpointResponseSchema = z.object({
  _id: z.coerce.string(),
  url: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type SwaggerEndpointResponse = z.infer<typeof SwaggerEndpointResponseSchema>;

export const SwaggerVersionResponseSchema = z.object({
  _id: z.coerce.string(),
  endpointId: z.coerce.string(),
  latestHash: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  content: z.any(),
});

export type SwaggerVersionResponse = z.infer<typeof SwaggerVersionResponseSchema>;
