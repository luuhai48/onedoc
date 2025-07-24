import type { SwaggerEndpointResponse, SwaggerPatchResponse } from '@onedoc/shared';

export const getListSwaggerEndpoints = async (): Promise<SwaggerEndpointResponse[]> => {
  const response = await fetch('/api/v1/swaggers?sort=order=desc');
  if (!response.ok) {
    throw new Error('Failed to fetch swagger endpoints');
  }
  return response.json();
};

export const getSwaggerVersions = async (
  endpointId: string,
  {
    limit = 10,
    page = 1,
  }: {
    limit?: number;
    page?: number;
  },
): Promise<{
  data: SwaggerPatchResponse[];
  total: number;
}> => {
  const queryParams = new URLSearchParams();
  queryParams.set('limit', limit.toString());
  queryParams.set('page', page.toString());
  const response = await fetch(`/api/v1/swaggers/${endpointId}/versions?${queryParams.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch swagger versions');
  }
  return response.json();
};
