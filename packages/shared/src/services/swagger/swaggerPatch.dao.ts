import { getSwaggerPatchModel, type SwaggerPatch } from '../../models/swaggerPatch';
import { BaseDao } from '../base/base.dao';

export class SwaggerPatchDao extends BaseDao<SwaggerPatch> {
  getModel() {
    return getSwaggerPatchModel;
  }
}
