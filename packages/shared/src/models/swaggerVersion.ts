import { type Connection, type Document, Schema } from 'mongoose';

// biome-ignore lint/suspicious/noExplicitAny: <ok>
export interface SwaggerVersion extends Document<any> {
  endpointId: Schema.Types.ObjectId;
  latestHash: string;
  // biome-ignore lint/suspicious/noExplicitAny: <ok>
  content: Record<string, any>;

  createdAt: Date;
  updatedAt: Date;
}

export const SwaggerVersionSchema = new Schema<SwaggerVersion>(
  {
    endpointId: { type: Schema.Types.ObjectId, required: true },
    latestHash: { type: String, required: true },
    content: { type: Object, required: true },
  },
  { timestamps: true },
);

export const getSwaggerVersionModel = (conn: Connection) =>
  conn.model<SwaggerVersion>('swagger_versions', SwaggerVersionSchema, 'swagger_versions');
