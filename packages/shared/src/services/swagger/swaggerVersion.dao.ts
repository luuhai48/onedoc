import { getSwaggerVersionModel, type SwaggerVersion } from '../../models/swaggerVersion';
import { BaseDao } from '../base/base.dao';

export class SwaggerVersionDao extends BaseDao<SwaggerVersion> {
  getModel() {
    return getSwaggerVersionModel;
  }
}
