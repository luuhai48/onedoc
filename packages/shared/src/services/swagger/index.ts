import type { SwaggerDao } from './swagger.dao';

export class SwaggerService {
  constructor(private readonly swaggerDao: SwaggerDao) {}

  public async list() {
    return this.swaggerDao.getDocuments({
      sort: {
        createdAt: -1,
      },
      lean: true,
    });
  }
}
