import { getSwaggerPatchModel, type ISwaggerPatch } from '../../models/swaggerPatch';
import { BaseDao } from '../base/base.dao';

export class SwaggerPatchDao extends BaseDao<ISwaggerPatch> {
  getModel() {
    return getSwaggerPatchModel;
  }
}
