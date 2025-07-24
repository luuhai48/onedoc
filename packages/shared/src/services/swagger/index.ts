import { type PaginationFilter, SwaggerEndpointResponseSchema } from '../../types';
import type { SwaggerDao } from './swaggerEndpoint.dao';

export class SwaggerService {
  constructor(private readonly swaggerDao: SwaggerDao) {}

  public async listEndpoints(filter: PaginationFilter) {
    const [data, total] = await Promise.all([
      this.swaggerDao.getDocuments({
        skip: (filter.page - 1) * filter.limit,
        limit: filter.limit,
        sort: {
          [filter.sort]: filter.order === 'asc' ? 1 : -1,
        },
        lean: true,
      }),
      this.swaggerDao.count({}),
    ]);

    return {
      data: data.map((item) => SwaggerEndpointResponseSchema.parse(item)),
      total,
    };
  }
}
