import { type Connection, type Document, Schema } from 'mongoose';

export interface ISwaggerEndpoint extends Document<any> {
  url: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const SwaggerEndpointSchema = new Schema<ISwaggerEndpoint>(
  {
    url: { type: String, required: true },
    name: { type: String, required: true },
  },
  { timestamps: true, versionKey: false },
);

export const getSwaggerEndpointModel = (conn: Connection) =>
  conn.model<ISwaggerEndpoint>('swagger_endpoints', SwaggerEndpointSchema, 'swagger_endpoints');
