import { SwaggerService } from '../services/swagger';
import { SwaggerEndpointDao } from '../services/swagger/swaggerEndpoint.dao';
import { SwaggerPatchDao } from '../services/swagger/swaggerPatch.dao';
import { SwaggerVersionDao } from '../services/swagger/swaggerVersion.dao';
import { MongoService } from './mongo';

type ServiceRegistry = {
  // register services here: E.g. UserService, AuthService, etc.
  swaggerService: SwaggerService;
};

export class Container {
  private static instance: Container;
  private services: Map<keyof ServiceRegistry, ServiceRegistry[keyof ServiceRegistry]> = new Map();

  private constructor() {
    this.initializeServices();
  }

  private initializeServices() {
    const mongoService = MongoService.getInstance();

    const swaggerEndpointDao = new SwaggerEndpointDao(mongoService.getConnection());
    const swaggerVersionDao = new SwaggerVersionDao(mongoService.getConnection());
    const swaggerPatchDao = new SwaggerPatchDao(mongoService.getConnection());

    this.services.set('swaggerService', new SwaggerService(swaggerEndpointDao, swaggerVersionDao, swaggerPatchDao));
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

export const service = <K extends keyof ServiceRegistry>(serviceName: K): ServiceRegistry[K] => {
  return Container.getInstance().get(serviceName);
};
