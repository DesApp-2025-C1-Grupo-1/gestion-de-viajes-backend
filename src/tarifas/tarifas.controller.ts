import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TarifasService } from './tarifas.service';
import { ZonaDto } from './dto/zona.dto';
import { TarifaDto } from './dto/tarifa.dto';

@ApiTags('tarifas')
@Controller('tarifas')
export class TarifasController {
  constructor(private readonly tarifasService: TarifasService) {}

  @Get('zonas')
  @ApiOperation({ summary: 'Obtener todas las zonas disponibles' })
  @ApiResponse({
    status: 200,
    description: 'Lista de zonas obtenida exitosamente.',
    type: [ZonaDto],
  })
  async getZonas(): Promise<ZonaDto[]> {
    return await this.tarifasService.getZonas();
  }

  @Get()
  @ApiOperation({ summary: 'Obtener tarifas filtradas por transportista y tipo de vehículo' })
  @ApiQuery({
    name: 'transportistaId',
    required: false,
    description: 'ID del transportista',
    type: Number,
  })
  @ApiQuery({
    name: 'tipoVehiculoId',
    required: false,
    description: 'ID del tipo de vehículo',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Tarifas obtenidas exitosamente.',
    type: [TarifaDto],
  })
  async getTarifas(
    @Query('transportistaId') transportistaId?: number,
    @Query('tipoVehiculoId') tipoVehiculoId?: number,
  ): Promise<TarifaDto[]> {
    return await this.tarifasService.getTarifas(transportistaId, tipoVehiculoId);
  }
}