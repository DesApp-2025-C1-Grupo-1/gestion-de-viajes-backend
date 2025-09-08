import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TarifasController } from './tarifas.controller';
import { TarifasService } from './tarifas.service';

@Module({
  imports: [HttpModule], // Para consumir APIs externas
  controllers: [TarifasController],
  providers: [TarifasService],
})
export class TarifasModule {}
