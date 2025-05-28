import { Module } from '@nestjs/common';
import { DepositoService } from './deposito.service';
import { DepositoController } from './deposito.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Deposito, DepositoSchema } from './Schemas/deposito.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Deposito.name, schema: DepositoSchema },
    ]),
  ],
  controllers: [DepositoController],
  providers: [DepositoService],
  exports: [MongooseModule],
})
export class DepositoModule {}
