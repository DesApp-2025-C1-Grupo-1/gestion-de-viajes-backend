import { Controller, Get } from '@nestjs/common';
import { TarifasService } from './tarifas.service';

@Controller('tarifas')
export class TarifasController {
  constructor(private readonly tarifasService: TarifasService) {}

  @Get()
  async obtenerTarifas() {
    return this.tarifasService.obtenerTarifas();
  }
}