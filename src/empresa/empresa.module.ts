import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Empresa, EmpresaSchema } from './schemas/empresa.schema';
import { EmpresaController } from './empresa.controller';
import { EmpresaService } from './empresa.service';
import { VehiculoModule } from 'src/vehiculo/vehiculo.module';
import { ChoferModule } from 'src/chofer/chofer.module';
import { ViajeModule } from 'src/viaje/viaje.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Empresa.name, schema: EmpresaSchema }]),
    forwardRef(() => VehiculoModule),
    forwardRef(() => ChoferModule),
    forwardRef(() => ViajeModule),
  ],
  controllers: [EmpresaController],
  providers: [EmpresaService],
  exports: [MongooseModule],
})
export class EmpresaModule {}
