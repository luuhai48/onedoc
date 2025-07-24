import type { SwaggerEndpointResponse } from '@onedoc/shared';

export const getListSwaggerEndpoints = async (): Promise<{
  data: SwaggerEndpointResponse[];
  total: number;
}> => {
  const response = await fetch('/api/v1/swaggers');
  if (!response.ok) {
    throw new Error('Failed to fetch swagger endpoints');
  }
  return response.json();
};
