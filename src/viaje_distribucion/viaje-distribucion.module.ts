import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ViajeDistribucionService } from './viaje-distribucion.service';
import { ViajeDistribucionController } from './viaje-distribucion.controller';
import {
  ViajeDistribucion,
  ViajeDistribucionSchema,
} from './schemas/viaje-distribucion.schema';
import { ChoferModule } from 'src/chofer/chofer.module';
import { EmpresaModule } from 'src/empresa/empresa.module';
import { VehiculoModule } from 'src/vehiculo/vehiculo.module';
import { DepositoModule } from 'src/deposito/deposito.module';
import { RemitosModule } from 'src/remitos/remitos.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ViajeDistribucion.name, schema: ViajeDistribucionSchema },
    ]),
    forwardRef(() => ChoferModule),
    forwardRef(() => EmpresaModule),
    forwardRef(() => VehiculoModule),
    forwardRef(() => DepositoModule),
    RemitosModule,
  ],
  controllers: [ViajeDistribucionController],
  providers: [ViajeDistribucionService],
  exports: [MongooseModule, ViajeDistribucionService],
})
export class ViajeDistribucionModule {}
