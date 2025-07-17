import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TipoVehiculoService } from './tipo_vehiculo.service';
import { TipoVehiculoController } from './tipo_vehiculo.controller';
import {
  TipoVehiculo,
  TipoVehiculoSchema,
} from './schemas/tipo_vehiculo.schema';
import { VehiculoModule } from 'src/vehiculo/vehiculo.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TipoVehiculo.name, schema: TipoVehiculoSchema },
    ]),
    forwardRef(() => VehiculoModule),
  ],
  controllers: [TipoVehiculoController],
  providers: [TipoVehiculoService],
  exports: [MongooseModule],
})
export class TipoVehiculoModule {}
