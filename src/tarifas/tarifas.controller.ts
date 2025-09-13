import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { TarifasService } from './tarifas.service';
import { ZonaDto } from './dto/zona.dto';
import { TarifaDto } from './dto/tarifa.dto';

@Controller('tarifas')
export class TarifasController {
  constructor(private readonly tarifasService: TarifasService) {}

  // Endpoint para listar todas las zonas
  @Get('zonas')
  @ApiOperation({ summary: 'Listar todas las zonas' })
  @ApiResponse({
    status: 200,
    description: 'Zonas obtenidas correctamente',
    type: [ZonaDto],
  })
  @ApiResponse({ status: 404, description: 'No se encontraron zonas' })
  async listarZonas(): Promise<ZonaDto[]> {
    return this.tarifasService.obtenerZonas();
  }

  // Endpoint para obtener tarifas filtradas por tipoVehiculo, zona y transportista
  @Get('filtradas')
  @ApiOperation({
    summary:
      'Obtener tarifas filtradas por tipo de vehículo, zona y transportista',
  })
  @ApiQuery({
    name: 'tipoVehiculo',
    required: true,
    description: 'ID del tipo de vehículo',
  })
  @ApiQuery({ name: 'zona', required: true, description: 'ID de la zona' })
  @ApiQuery({
    name: 'transportista',
    required: true,
    description: 'ID del transportista',
  })
  @ApiResponse({
    status: 200,
    description: 'Tarifas filtradas obtenidas correctamente',
    type: [TarifaDto],
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron tarifas para los filtros proporcionados',
  })
  async tarifasFiltradas(
    @Query('tipoVehiculo') tipoVehiculo: string,
    @Query('zona') zona: string,
    @Query('transportista') transportista: string,
  ): Promise<TarifaDto[]> {
    const tipoVehiculoId = parseInt(tipoVehiculo, 10);
    const zonaId = parseInt(zona, 10);
    const transportistaId = parseInt(transportista, 10);

    return this.tarifasService.obtenerTarifasFiltradas(
      tipoVehiculoId,
      zonaId,
      transportistaId,
    );
  }
}
