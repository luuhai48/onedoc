import type { ISwaggerListItemResponse } from '@onedoc/shared';

export const getListSwaggerUrls = async (): Promise<ISwaggerListItemResponse[]> => {
  const response = await fetch('/api/v1/swaggers');
  if (!response.ok) {
    throw new Error('Failed to fetch swagger endpoints');
  }
  return response.json();
};
