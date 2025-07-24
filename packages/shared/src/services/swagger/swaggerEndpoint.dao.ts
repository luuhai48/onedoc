import { getSwaggerEndpointModel, type ISwaggerEndpoint } from '../../models/swaggerEndpoint';
import { BaseDao } from '../base/base.dao';

export class SwaggerEndpointDao extends BaseDao<ISwaggerEndpoint> {
  getModel() {
    return getSwaggerEndpointModel;
  }
}
