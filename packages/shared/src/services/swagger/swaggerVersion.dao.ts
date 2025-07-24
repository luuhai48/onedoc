import { getSwaggerVersionModel, type ISwaggerVersion } from '../../models/swaggerVersion';
import { BaseDao } from '../base/base.dao';

export class SwaggerVersionDao extends BaseDao<ISwaggerVersion> {
  getModel() {
    return getSwaggerVersionModel;
  }
}
