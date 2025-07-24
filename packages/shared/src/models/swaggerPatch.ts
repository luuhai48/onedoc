import { type Connection, type Document, Schema } from 'mongoose';

export interface ISwaggerPatch extends Document<any> {
  endpointId: Schema.Types.ObjectId;
  patch: Record<string, any>;
  hash: string;
  createdAt: Date;
  updatedAt: Date;
}

export const SwaggerPatchSchema = new Schema<ISwaggerPatch>(
  {
    endpointId: { type: Schema.Types.ObjectId, required: true },
    patch: { type: Object, required: true },
    hash: { type: String, required: true },
  },
  { timestamps: true, versionKey: false },
);

export const getSwaggerPatchModel = (conn: Connection) =>
  conn.model<ISwaggerPatch>('swagger_patches', SwaggerPatchSchema, 'swagger_patches');
