export const getListSwaggerEndpoints = async (): Promise<string[]> => {
  const response = await fetch('/api/v1/swaggers');
  if (!response.ok) {
    throw new Error('Failed to fetch swagger endpoints');
  }
  return response.json();
};
