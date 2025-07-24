import type { Delta } from 'jsondiffpatch';
import {
  type PaginationFilter,
  type SwaggerEndpointResponse,
  SwaggerEndpointResponseSchema,
  type SwaggerVersionResponse,
  SwaggerVersionResponseSchema,
} from '../../types';
import { undoPatch } from '../../utils';
import type { SwaggerEndpointDao } from './swaggerEndpoint.dao';
import type { SwaggerPatchDao } from './swaggerPatch.dao';
import type { SwaggerVersionDao } from './swaggerVersion.dao';

export class SwaggerService {
  constructor(
    private readonly swaggerEndpointDao: SwaggerEndpointDao,
    private readonly swaggerVersionDao: SwaggerVersionDao,
    private readonly swaggerPatchDao: SwaggerPatchDao,
  ) {}

  public async listEndpoints(filter: PaginationFilter): Promise<SwaggerEndpointResponse[]> {
    const data = await this.swaggerEndpointDao.getDocuments({
      sort: {
        [filter.sort ?? '_id']: filter.order === 'asc' ? 1 : -1,
      },
      lean: true,
    });

    return data.map((item) => SwaggerEndpointResponseSchema.parse(item));
  }

  async getSwaggerVersion(endpointId: string, hash?: string): Promise<SwaggerVersionResponse | null> {
    const data = await this.swaggerVersionDao.getDocument({
      filter: {
        endpointId,
        ...(hash && { hash }),
      },
      sort: {
        _id: -1,
      },
      lean: true,
    });

    return data ? SwaggerVersionResponseSchema.parse(data) : null;
  }

  async upsertSwaggerVersion(endpointId: string, hash: string, content: Record<string, any>) {
    return this.swaggerVersionDao.updateDocument({
      filter: {
        endpointId,
      },
      update: {
        endpointId,
        latestHash: hash,
        content,
      },
      sort: {
        _id: -1,
      },
      upsert: true,
    });
  }

  async upsertSwaggerPatch(endpointId: string, hash: string, patch: Delta) {
    return this.swaggerPatchDao.updateDocument({
      filter: {
        endpointId,
        hash,
      },
      update: {
        endpointId,
        hash,
        patch,
      },
      sort: {
        _id: -1,
      },
      upsert: true,
    });
  }

  async listPatches(endpointId: string, filter: PaginationFilter) {
    return this.swaggerPatchDao.getDocuments({
      filter: {
        endpointId,
        ...(filter.afterId && { _id: { $gte: filter.afterId } }),
        ...(filter.beforeId && { _id: { $lte: filter.beforeId } }),
      },
      sort: {
        [filter.sort ?? '_id']: filter.order === 'asc' ? 1 : -1,
      },
      lean: true,
    });
  }

  async getSwaggerVersionByPatchId(endpointId: string, patchId: string) {
    const version = await this.swaggerVersionDao.getDocument({
      filter: { endpointId },
      sort: { _id: -1 },
      lean: true,
    });

    if (!version) return null;

    const patches = await this.swaggerPatchDao.getDocuments({
      filter: {
        endpointId,
        _id: { $gte: patchId },
      },
      sort: {
        _id: -1,
      },
      lean: true,
    });

    for (const patch of patches) {
      try {
        version.content = undoPatch(version.content, patch.patch as Delta);
      } catch (err) {
        return err;
      }
    }

    return version;
  }
}
