import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { TarifasService } from './tarifas.service';
import { ZonaDto } from './dto/zona.dto';
import { TarifaDto } from './dto/tarifa.dto';

@ApiTags('Tarifas')
@Controller('tarifas')
export class TarifasController {
  constructor(private readonly tarifasService: TarifasService) {}

  // 🔹 Listar todas las zonas
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

  // 🔹 Tarifas filtradas por tipoVehiculo, zona y transportista
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
    @Query('zona') zona: number,
    @Query('transportista') transportista: string,
  ): Promise<TarifaDto[]> {
    return this.tarifasService.obtenerTarifasFiltradas(
      tipoVehiculo,
      zona,
      transportista,
    );
  }

  // 🔹 Cantidad total de tarifas
  @Get('cantidad')
  @ApiOperation({ summary: 'Obtener cantidad total de tarifas' })
  @ApiResponse({
    status: 200,
    description: 'Cantidad total de tarifas obtenida correctamente',
    schema: { example: { total: 42 } },
  })
  @ApiResponse({
    status: 404,
    description: 'No se pudieron contar las tarifas',
  })
  async obtenerCantidadTarifas(): Promise<{ total: number }> {
    return this.tarifasService.obtenerCantidadTarifas();
  }

  // 🔹 Comparativa de costos por zona
  @Get('comparativa-costos')
  @ApiOperation({ summary: 'Obtener comparativa de costos por zona' })
  @ApiResponse({
    status: 200,
    description: 'Comparativa de costos obtenida correctamente',
    schema: {
      example: [
        { nombre: 'Buenos Aires', promedio: 2500, maximo: 4000 },
        { nombre: 'Córdoba', promedio: 2300, maximo: 3500 },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'No se pudo obtener la comparativa de costos',
  })
  async obtenerComparativaCostos(): Promise<
    { nombre: string; promedio: number; maximo: number }[]
  > {
    return this.tarifasService.obtenerComparativaCostos();
  }

  // 🔹 Obtener tarifa por ID (endpoint dinámico al final)
  @Get(':id')
  @ApiOperation({ summary: 'Obtener tarifa por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la tarifa' })
  @ApiResponse({
    status: 200,
    description: 'Tarifa obtenida correctamente',
    type: TarifaDto,
  })
  @ApiResponse({ status: 404, description: 'No se encontraron tarifas' })
  async getTarifaById(@Param('id') id: number): Promise<TarifaDto> {
    return this.tarifasService.obtenerTarifaById(id);
  }

  // Obtener todas las tarifas
  @Get()
  @ApiOperation({ summary: 'Obtener todas las tarifas' }) 
  @ApiResponse({
    status: 200,
    description: 'Tarifas obtenidas correctamente',
    type: [TarifaDto],
  })
  @ApiResponse({ status: 404, description: 'No se encontraron tarifas' })
  async getTarifas(): Promise<TarifaDto[]> {
    return this.tarifasService.obtenerTarifas();
  }
}
