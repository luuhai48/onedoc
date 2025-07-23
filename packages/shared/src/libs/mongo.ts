import mongoose from 'mongoose';
import { getEnv } from './env';

export class MongoService {
  private static instance: MongoService;
  private connection: mongoose.Connection;

  private constructor() {
    this.connection = mongoose.createConnection(getEnv('MONGO_URI'), {
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
    });
  }

  public static getInstance(): MongoService {
    if (!MongoService.instance) {
      MongoService.instance = new MongoService();
    }
    return MongoService.instance;
  }

  public getConnection(): mongoose.Connection {
    return this.connection;
  }

  public static async connect() {
    if (MongoService.getInstance().getConnection().readyState === mongoose.ConnectionStates.connected) {
      return true;
    }

    return await new Promise<boolean>((resolve) => {
      const interval = setInterval(() => {
        if (MongoService.getInstance().getConnection().readyState === mongoose.ConnectionStates.connected) {
          clearInterval(interval);
          resolve(true);
        }
      }, 500);
    });
  }

  public static async disconnect() {
    await MongoService.getInstance().getConnection().close();
  }
}
