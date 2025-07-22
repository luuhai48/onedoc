// TODO: remove
interface SampleService {
  getUser(id: string): any;
}

type ServiceRegistry = {
  // register services here: E.g. UserService, AuthService, etc.
  sampleService: SampleService;
};

export class Container {
  private static instance: Container;
  private services: Map<keyof ServiceRegistry, ServiceRegistry[keyof ServiceRegistry]> = new Map();

  private constructor() {
    this.initializeServices();
  }

  private initializeServices() {
    // this.services.set('sample', new SampleService());
  }

  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  public get<K extends keyof ServiceRegistry>(serviceName: K): ServiceRegistry[K] {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not found`);
    }
    return service as ServiceRegistry[K];
  }
}
