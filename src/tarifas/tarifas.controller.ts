import { Controller, Get, Query } from '@nestjs/common';
import { TarifasService } from './tarifas.service';

@Controller('tarifas')
export class TarifasController {
  constructor(private readonly tarifasService: TarifasService) {}

  // Endpoint para listar todas las zonas
  @Get('zonas')
  async listarZonas() {
    return this.tarifasService.obtenerZonas();
  }

  // Endpoint para obtener tarifas filtradas por tipoVehiculo, zona y transportista
  @Get('filtradas')
  async tarifasFiltradas(
    @Query('tipoVehiculo') tipoVehiculo: string,
    @Query('zona') zona: string,
    @Query('transportista') transportista: string,
  ) {
    // Convertimos a número porque la API espera IDs numéricos
    const tipoVehiculoId = parseInt(tipoVehiculo);
    const zonaId = parseInt(zona);
    const transportistaId = parseInt(transportista);

    return this.tarifasService.obtenerTarifasFiltradas(tipoVehiculoId, zonaId, transportistaId);
  }
}