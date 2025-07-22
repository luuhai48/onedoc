export class EnvironmentService {
  private static instance: EnvironmentService;
  private cache: Map<string, string> = new Map();

  private constructor() {
    Object.keys(process.env).forEach((key) => {
      this.cache.set(key, process.env[key] || '');
    });
  }

  public static getInstance(): EnvironmentService {
    if (!EnvironmentService.instance) {
      EnvironmentService.instance = new EnvironmentService();
    }
    return EnvironmentService.instance;
  }

  public get(key: string, defaultValue?: string): string {
    if (!this.cache.has(key)) {
      this.cache.set(key, process.env[key] || defaultValue || '');
    }
    return this.cache.get(key) || defaultValue || '';
  }
}

export const getEnv = (key: string, defaultValue?: string): string => {
  return EnvironmentService.getInstance().get(key, defaultValue);
};
