import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Vehiculo, VehiculoSchema } from './schemas/vehiculo.schema';
import { VehiculoService } from './vehiculo.service';
import { VehiculoController } from './vehiculo.controller';
import { TipoVehiculoModule } from 'src/tipo_vehiculo/tipo_vehiculo.module';
import { EmpresaModule } from 'src/empresa/empresa.module';
import { ChoferModule } from 'src/chofer/chofer.module';
import { ViajeModule } from 'src/viaje/viaje.module';
import { ViajeDistribucionModule } from 'src/viaje_distribucion/viaje-distribucion.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Vehiculo.name, schema: VehiculoSchema },
    ]),
    forwardRef(() => TipoVehiculoModule),
    forwardRef(() => EmpresaModule),
    forwardRef(() => ChoferModule),
    forwardRef(() => ViajeModule),
    forwardRef(() => ViajeDistribucionModule),
  ],
  controllers: [VehiculoController],
  providers: [VehiculoService],
  exports: [MongooseModule],
})
export class VehiculoModule {}
