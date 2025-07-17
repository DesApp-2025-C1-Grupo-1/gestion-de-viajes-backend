import { forwardRef, Module } from '@nestjs/common';
import { DepositoService } from './deposito.service';
import { DepositoController } from './deposito.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Deposito, DepositoSchema } from './schemas/deposito.schema';
import { ViajeModule } from 'src/viaje/viaje.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Deposito.name, schema: DepositoSchema },
    ]),
    forwardRef(() => ViajeModule),
  ],
  controllers: [DepositoController],
  providers: [DepositoService],
  exports: [MongooseModule],
})
export class DepositoModule {}
