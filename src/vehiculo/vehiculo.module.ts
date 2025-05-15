import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Vehiculo, VehiculoSchema } from './schemas/vehiculo.schema';
import { VehiculoService } from './vehiculo.service';
import { VehiculoController } from './vehiculo.controller';
import { ValidateTipoVehiculoExistsPipe } from 'src/common/pipes/validate_TipoVehiculo_exists.pipe';
import { ValidateEmpresaExistsPipe } from 'src/common/pipes/validate_Empresa_exists.pipe';
import { TipoVehiculoModule } from 'src/tipo_vehiculo/tipo_vehiculo.module';
import { EmpresaModule } from 'src/empresa/empresa.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Vehiculo.name, schema: VehiculoSchema },
    ]),
    TipoVehiculoModule,
    EmpresaModule,
  ],
  controllers: [VehiculoController],
  providers: [
    VehiculoService,
    ValidateTipoVehiculoExistsPipe,
    ValidateEmpresaExistsPipe,
  ],
  exports: [MongooseModule],
})
export class VehiculoModule {}
