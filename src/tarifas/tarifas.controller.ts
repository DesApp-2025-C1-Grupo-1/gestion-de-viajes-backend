import { Controller, Get } from '@nestjs/common';
import { TarifaService } from './tarifas.service';

@Controller('tarifas')
export class TarifaController {
  constructor(private readonly tarifaService: TarifaService) {}

  @Get()
  async listarTarifas() {
    return this.tarifaService.obtenerTarifas();
  }
}