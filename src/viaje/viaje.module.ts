import { forwardRef, Module } from '@nestjs/common';
import { ViajeService } from './viaje.service';
import { ViajeController } from './viaje.controller';
import { EmpresaModule } from 'src/empresa/empresa.module';
import { VehiculoModule } from 'src/vehiculo/vehiculo.module';
import { ChoferModule } from 'src/chofer/chofer.module';
import { DepositoModule } from 'src/deposito/deposito.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Viaje, ViajeSchema } from './schemas/viaje.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Viaje.name, schema: ViajeSchema }]),
    forwardRef(() => EmpresaModule),
    forwardRef(() => VehiculoModule),
    forwardRef(() => ChoferModule),
    forwardRef(() => DepositoModule),
  ],
  controllers: [ViajeController],
  providers: [ViajeService],
  exports: [MongooseModule],
})
export class ViajeModule {}
