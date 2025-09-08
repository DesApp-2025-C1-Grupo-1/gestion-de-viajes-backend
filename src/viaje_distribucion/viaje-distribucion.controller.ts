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
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateViajeDistribucionDto } from './dto/create-viaje-distribucion.dto';
import { UpdateViajeDistribucionDto } from './dto/update-viaje-distribucion.dto';
import { ViajeDistribucionDto } from './dto/viaje-distribucion.dto';
import { ViajeDistribucionService } from './viaje-distribucion.service';

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
    type: ViajeDistribucionDto,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  async create(
    @Body() createViajeDistribucionDto: CreateViajeDistribucionDto,
  ): Promise<ViajeDistribucionDto> {
    return this.viajeDistribucionService.create(createViajeDistribucionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los viajes de distribución' })
  @ApiResponse({
    status: 200,
    description: 'Lista de viajes de distribución obtenida exitosamente.',
    type: [ViajeDistribucionDto],
  })
  @ApiQuery({
    name: 'estado',
    required: false,
    description: 'Filtrar por estado',
    enum: ['iniciado', 'cargando', 'cargado', 'finalizado'],
  })
  async findAll(
    @Query('estado') estado?: string,
  ): Promise<ViajeDistribucionDto[]> {
    const viajesDistribucion = estado
      ? await this.viajeDistribucionService.findByEstado(estado)
      : await this.viajeDistribucionService.findAll();

    return viajesDistribucion;
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
  async findOne(@Param('id') id: string): Promise<ViajeDistribucionDto> {
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
  ): Promise<ViajeDistribucionDto> {
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
  ): Promise<ViajeDistribucionDto> {
    return await this.viajeDistribucionService.updateEstado(id, estado);
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
}
