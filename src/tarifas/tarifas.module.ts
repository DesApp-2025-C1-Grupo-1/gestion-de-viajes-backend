import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'; // para hacer requests HTTP
import { TarifaService } from './tarifas.service';
import { TarifaController } from './tarifas.controller';

@Module({
  imports: [HttpModule],
  controllers: [TarifaController],
  providers: [TarifaService],
})
export class TarifaModule {}