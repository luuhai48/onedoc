import { getSwaggerEndpointModel, type ISwaggerEndpoint } from '../../models/swagger';
import { BaseDao } from '../base/base.dao';

export class SwaggerDao extends BaseDao<ISwaggerEndpoint> {
  getModel() {
    return getSwaggerEndpointModel;
  }
}
