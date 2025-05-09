import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TipoVehiculoModule } from './tipo_vehiculo/tipo_vehiculo.module';

@Module({
  imports: [
    TipoVehiculoModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: () => {
        const user = encodeURIComponent(
          process.env.MONGO_USER || 'UsuarioQueVaAFallar',
        );
        const pass = encodeURIComponent(
          process.env.MONGO_PASS || 'ContraseñaQueVaAFallar',
        );

        const uri = `mongodb+srv://${user}:${pass}@gestion-viajes.n4d4ucz.mongodb.net/entidades?retryWrites=true&w=majority&appName=gestion-viajes`;

        return { uri };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
