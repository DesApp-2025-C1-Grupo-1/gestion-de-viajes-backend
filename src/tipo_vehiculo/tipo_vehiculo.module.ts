import { Module } from '@nestjs/common';
import { TipoVehiculoService } from './tipo_vehiculo.service';
import { TipoVehiculoController } from './tipo_vehiculo.controller';

@Module({
  controllers: [TipoVehiculoController],
  providers: [TipoVehiculoService],
})
export class TipoVehiculoModule {}
