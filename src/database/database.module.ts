import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRootAsync({
            useFactory: () => ({
                uri: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@gestion-viajes.n4d4ucz.mongodb.net/entidades?retryWrites=true&w=majority&appName=gestion-viajes`
            })
        }),
    ],
    exports: [MongooseModule],
})
export class DatabaseModule { } 