import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateViajeDistribucionDto } from './dto/create-viaje-distribucion.dto';
import { UpdateViajeDistribucionDto } from './dto/update-viaje-distribucion.dto';
import { ViajeDistribucionDto } from './dto/viaje-distribucion.dto';
import { ViajeDistribucionService } from './viaje-distribucion.service';
import { TransformObjectIdFieldsPipe } from 'src/common/pipes/transform_objectId_fields.pipe';
import { ViajeDistribucion } from './schemas/viaje-distribucion.schema';
import { ValidateEntityExistsPipe } from 'src/common/pipes/validate_entity_exists.pipe';
import { Vehiculo } from 'src/vehiculo/schemas/vehiculo.schema';
import { Empresa } from 'src/empresa/schemas/empresa.schema';
import { Deposito } from 'src/deposito/schemas/deposito.schema';
import { Chofer } from 'src/chofer/schemas/chofer.schema';
import { QueryPaginacionDto } from 'src/common/dto/query-paginacion.dto';
import { PaginacionDistribucionDto } from 'src/common/dto/paginacion-distribucion.dto';
import { BuscarViajeDistribucionDto } from './dto/buscar-viaje-distribucion.dto';

@ApiTags('viaje-distribucion')
@Controller('viaje-distribucion')
export class ViajeDistribucionController {
  constructor(
    private readonly viajeDistribucionService: ViajeDistribucionService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo viaje de distribución' })
  @ApiResponse({
    status: 201,
    description: 'Viaje de distribución creado exitosamente.',
    type: CreateViajeDistribucionDto,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  async create(
    @Body(
      ValidateEntityExistsPipe(Vehiculo, 'vehiculo', 'Vehículo'),
      ValidateEntityExistsPipe(
        Empresa,
        'transportista',
        'Empresa transportista',
      ),
      ValidateEntityExistsPipe(Deposito, 'origen', 'Depósito de Origen'),
      ValidateEntityExistsPipe(Chofer, 'chofer', 'Chofer'),
      new TransformObjectIdFieldsPipe([
        'origen',
        'chofer',
        'transportista',
        'vehiculo',
      ]),
    )
    createViajeDistribucionDto: CreateViajeDistribucionDto,
  ) {
    return this.viajeDistribucionService.create(createViajeDistribucionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los viajes de distribución' })
  @ApiResponse({
    status: 200,
    description: 'Lista de viajes de distribución obtenida exitosamente.',
    type: PaginacionDistribucionDto,
  })
  async findAll(@Query() queryPaginacionDto: QueryPaginacionDto) {
    return this.viajeDistribucionService.findAll(queryPaginacionDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un viaje de distribución por ID' })
  @ApiParam({ name: 'id', description: 'ID del viaje de distribución' })
  @ApiResponse({
    status: 200,
    description: 'Viaje de distribución encontrado.',
    type: ViajeDistribucionDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Viaje de distribución no encontrado.',
  })
  async findOne(@Param('id') id: string): Promise<ViajeDistribucion> {
    return await this.viajeDistribucionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un viaje de distribución' })
  @ApiParam({ name: 'id', description: 'ID del viaje de distribución' })
  @ApiResponse({
    status: 200,
    description: 'Viaje de distribución actualizado exitosamente.',
    type: ViajeDistribucionDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Viaje de distribución no encontrado.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateViajeDistribucionDto: UpdateViajeDistribucionDto,
  ): Promise<ViajeDistribucion> {
    return await this.viajeDistribucionService.update(
      id,
      updateViajeDistribucionDto,
    );
  }

  @Patch(':id/estado')
  @ApiOperation({ summary: 'Actualizar el estado de un viaje de distribución' })
  @ApiParam({ name: 'id', description: 'ID del viaje de distribución' })
  @ApiResponse({
    status: 200,
    description: 'Estado actualizado exitosamente.',
    type: ViajeDistribucionDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Viaje de distribución no encontrado.',
  })
  async updateEstado(
    @Param('id') id: string,
    @Body('estado') estado: string,
    @Body('kilometros') kilometros?: number,
  ): Promise<ViajeDistribucion> {
    return await this.viajeDistribucionService.updateEstado(
      id,
      estado,
      kilometros,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un viaje de distribución' })
  @ApiParam({ name: 'id', description: 'ID del viaje de distribución' })
  @ApiResponse({
    status: 204,
    description: 'Viaje de distribución eliminado exitosamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Viaje de distribución no encontrado.',
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.viajeDistribucionService.remove(id);
  }

  @ApiOperation({ summary: 'Buscar viajes por filtros' })
  @ApiResponse({
    status: 200,
    description: 'Viajes filtrados correctamente',
    type: PaginacionDistribucionDto,
  })
  @Post('buscar')
  async buscar(
    @Body() filtros: BuscarViajeDistribucionDto,
    @Query() queryPaginacion: QueryPaginacionDto,
  ) {
    return this.viajeDistribucionService.buscar(filtros, queryPaginacion);
  }
}
