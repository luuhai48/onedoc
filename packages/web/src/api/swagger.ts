import type { SwaggerEndpointResponse } from '@onedoc/shared';

export const getListSwaggerEndpoints = async (): Promise<SwaggerEndpointResponse[]> => {
  const response = await fetch('/api/v1/swaggers?sort=order=desc');
  if (!response.ok) {
    throw new Error('Failed to fetch swagger endpoints');
  }
  return response.json();
};
