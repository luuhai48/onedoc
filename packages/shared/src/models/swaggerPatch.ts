import { type Connection, type Document, Schema } from 'mongoose';

// biome-ignore lint/suspicious/noExplicitAny: <ok>
export interface SwaggerPatch extends Document<any> {
  endpointId: Schema.Types.ObjectId;
  // biome-ignore lint/suspicious/noExplicitAny: <ok>
  patch: Record<string, any>;
  hash: string;
  createdAt: Date;
  updatedAt: Date;
}

export const SwaggerPatchSchema = new Schema<SwaggerPatch>(
  {
    endpointId: { type: Schema.Types.ObjectId, required: true },
    patch: { type: Object, required: true },
    hash: { type: String, required: true },
  },
  { timestamps: true },
);

export const getSwaggerPatchModel = (conn: Connection) =>
  conn.model<SwaggerPatch>('swagger_patches', SwaggerPatchSchema, 'swagger_patches');
