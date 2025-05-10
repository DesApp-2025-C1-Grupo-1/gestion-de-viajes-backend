import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TipoVehiculoService } from './tipo_vehiculo.service';
import { TipoVehiculoController } from './tipo_vehiculo.controller';
import {
  TipoVehiculo,
  TipoVehiculoSchema,
} from './schemas/tipo_vehiculo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TipoVehiculo.name, schema: TipoVehiculoSchema },
    ]),
  ],
  controllers: [TipoVehiculoController],
  providers: [TipoVehiculoService],
  exports: [MongooseModule],
})
export class TipoVehiculoModule {}
