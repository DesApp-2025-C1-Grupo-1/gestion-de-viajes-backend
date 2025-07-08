import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ViajeService } from './viaje.service';
import { CreateViajeDto } from './dto/create-viaje.dto';
import { UpdateViajeDto } from './dto/update-viaje.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ViajeDto } from './dto/viaje.dto';
import { Empresa } from 'src/empresa/schemas/empresa.schema';
import { Deposito } from 'src/deposito/schemas/deposito.schema';
import { Vehiculo } from 'src/vehiculo/schemas/vehiculo.schema';
import { Chofer } from 'src/chofer/schemas/chofer.schema';
import { ValidateEntityExistsPipe } from '../common/pipes/validate_entity_exists.pipe';
import { TransformObjectIdFieldsPipe } from 'src/common/pipes/transform_objectId_fields.pipe';
import { BuscarViajeDto } from './dto/buscar-viaje.dto';
import { QueryPaginacionDto } from 'src/common/dto/query-paginacion.dto';
import { PaginacionDto } from 'src/common/dto/paginacion.dto';

@Controller('viaje')
export class ViajeController {
  constructor(private readonly viajeService: ViajeService) {}

  @ApiOperation({ summary: 'Crear un viaje' })
  @ApiResponse({
    status: 201,
    description: 'Viaje creado correctamente',
    type: ViajeDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos para crear un viaje',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe una viaje con esa patente',
  })
  @Post()
  create(
    @Body(
      ValidateEntityExistsPipe(Vehiculo, 'vehiculo', 'Vehículo'),
      ValidateEntityExistsPipe(Empresa, 'empresa', 'Empresa'),
      ValidateEntityExistsPipe(
        Deposito,
        'deposito_origen',
        'Depósito de Origen',
      ),
      ValidateEntityExistsPipe(
        Deposito,
        'deposito_destino',
        'Depósito de Destino',
      ),
      ValidateEntityExistsPipe(Chofer, 'chofer', 'Chofer'),
      new TransformObjectIdFieldsPipe([
        'deposito_origen',
        'deposito_destino',
        'empresa',
        'vehiculo',
        'chofer',
      ]),
    )
    createViajeDto: CreateViajeDto,
  ) {
    return this.viajeService.create(createViajeDto);
  }

  @ApiOperation({ summary: 'Obtener todos los viajes' })
  @ApiResponse({
    status: 200,
    description: 'Lista de viajes obtenida correctamente',
    type: PaginacionDto,
  })
  @ApiResponse({ status: 404, description: 'No se encontraron viajes' })
  @Get()
  findAll(@Query() queryPaginacionDto: QueryPaginacionDto) {
    return this.viajeService.findAll(queryPaginacionDto);
  }

  @ApiOperation({ summary: 'Obtener un viaje por ID' })
  @ApiResponse({
    status: 200,
    description: 'Viaje obtenido correctamente',
    type: ViajeDto,
  })
  @ApiResponse({ status: 404, description: 'Viaje no encontrado' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.viajeService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar un viaje' })
  @ApiResponse({
    status: 200,
    description: 'Viaje actualizado correctamente',
    type: ViajeDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos para actualizar un viaje',
  })
  @ApiResponse({
    status: 404,
    description: 'Viaje no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe una viaje con esa patente',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateViajeDto: UpdateViajeDto) {
    return this.viajeService.update(id, updateViajeDto);
  }

  @ApiOperation({ summary: 'Eliminar un viaje por ID' })
  @ApiResponse({ status: 200, description: 'Viaje eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'Viaje no encontrado' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.viajeService.remove(id);
  }

  @ApiOperation({ summary: 'Buscar viajes por filtros' })
  @ApiResponse({
    status: 200,
    description: 'Viajes filtrados correctamente',
    type: PaginacionDto,
  })
  @Post('buscar')
  async buscar(
    @Body() filtros: BuscarViajeDto,
    @Query() queryPaginacion: QueryPaginacionDto,
  ) {
    return this.viajeService.buscar(filtros, queryPaginacion);
  }
}
