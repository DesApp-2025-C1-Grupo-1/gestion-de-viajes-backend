import { Controller, Get } from '@nestjs/common';
import { TarifasService } from './tarifas.service';

@Controller('tarifas')
export class TarifasController {
  constructor(private readonly tarifasService: TarifasService) {}

  @Get()
  async listarTarifas() {
    return await this.tarifasService.obtenerTarifas();
  }
}
