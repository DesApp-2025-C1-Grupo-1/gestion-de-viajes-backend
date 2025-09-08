import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { MongoMemoryServer } from 'mongodb-memory-server';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: async (): Promise<{ uri: string }> => {
        if (process.env.NODE_ENV === 'test') {
          const mongod = await MongoMemoryServer.create();
          return {
            uri: mongod.getUri(),
          };
        }
        return {
          uri: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@gestion-viajes.n4d4ucz.mongodb.net/entidades?retryWrites=true&w=majority&appName=gestion-viajes&authSource=admin`,
        };
      },
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
