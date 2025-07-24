import { z } from 'zod';

export const SwaggerEndpointResponseSchema = z.object({
  _id: z.coerce.string(),
  url: z.string(),
  name: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type SwaggerEndpointResponse = z.infer<typeof SwaggerEndpointResponseSchema>;

export const SwaggerVersionResponseSchema = z.object({
  _id: z.coerce.string(),
  endpointId: z.coerce.string(),
  latestHash: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  content: z.any(),
});

export type SwaggerVersionResponse = z.infer<typeof SwaggerVersionResponseSchema>;

export const SwaggerPatchResponseSchema = z.object({
  _id: z.coerce.string(),
  endpointId: z.coerce.string(),
  patch: z.any(),
  createdAt: z.date(),
  updatedAt: z.date(),
  hash: z.string(),
});

export type SwaggerPatchResponse = z.infer<typeof SwaggerPatchResponseSchema>;
