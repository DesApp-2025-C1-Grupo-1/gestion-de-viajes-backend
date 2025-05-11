import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TipoVehiculoModule } from './tipo_vehiculo/tipo_vehiculo.module';
import { VehiculoModule } from './vehiculo/vehiculo.module';
import { EmpresaModule } from './empresa/empresa.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    TipoVehiculoModule,
    DatabaseModule,
    VehiculoModule,
    EmpresaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
