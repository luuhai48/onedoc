import { type Connection, type Document, Schema } from 'mongoose';

export interface ISwaggerVersion extends Document<any> {
  endpointId: Schema.Types.ObjectId;
  latestHash: string;
  content: Record<string, any>;

  createdAt: Date;
  updatedAt: Date;
}

export const SwaggerVersionSchema = new Schema<ISwaggerVersion>(
  {
    endpointId: { type: Schema.Types.ObjectId, required: true },
    latestHash: { type: String, required: true },
    content: { type: Object, required: true },
  },
  { timestamps: true, versionKey: false },
);

export const getSwaggerVersionModel = (conn: Connection) =>
  conn.model<ISwaggerVersion>('swagger_versions', SwaggerVersionSchema, 'swagger_versions');
