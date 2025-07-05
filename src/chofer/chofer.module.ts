import { forwardRef, Module } from '@nestjs/common';
import { ChoferService } from './chofer.service';
import { ChoferController } from './chofer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Chofer, ChoferSchema } from './schemas/chofer.schema';
import { VehiculoModule } from 'src/vehiculo/vehiculo.module';
import { EmpresaModule } from 'src/empresa/empresa.module';
import { ValidateVehiculoExistsPipe } from 'src/common/pipes/validate_Vehiculo_exists.pipe';
import { ValidateEmpresaExistsPipe } from 'src/common/pipes/validate_Empresa_exists.pipe';
import { ViajeModule } from 'src/viaje/viaje.module';
import { TipoVehiculoModule } from 'src/tipo_vehiculo/tipo_vehiculo.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chofer.name, schema: ChoferSchema }]),
    forwardRef(() => VehiculoModule),
    forwardRef(() => EmpresaModule),
    forwardRef(() => ViajeModule),
    forwardRef(() => TipoVehiculoModule),
  ],
  controllers: [ChoferController],
  providers: [
    ChoferService,
    ValidateVehiculoExistsPipe,
    ValidateEmpresaExistsPipe,
  ],
  exports: [MongooseModule],
})
export class ChoferModule {}
