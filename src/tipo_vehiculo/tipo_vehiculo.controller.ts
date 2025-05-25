import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TipoVehiculoService } from './tipo_vehiculo.service';
import { CreateTipoVehiculoDto } from './dto/create-tipo_vehiculo.dto';
import { UpdateTipoVehiculoDto } from './dto/update-tipo_vehiculo.dto';
import { TipoVehiculo } from './schemas/tipo_vehiculo.schema';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { EmptyObjectPipe } from 'src/common/pipes/empty_object.pipe';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TipoVehiculoDto } from './dto/tipo-vehiculo.dto';

@Controller('tipo_vehiculo')
export class TipoVehiculoController {
  constructor(private readonly tipoVehiculoService: TipoVehiculoService) {}

  @ApiOperation({ summary: 'Crear un tipo de vehículo' })
  @ApiResponse({
    status: 201,
    description: 'Tipo de vehículo creado correctamente',
    type: TipoVehiculoDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos para crear un tipo de vehículo',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un tipo de vehiculo con ese nombre',
  })
  @Post()
  create(
    @Body() createTipoVehiculoDto: CreateTipoVehiculoDto,
  ): Promise<TipoVehiculo> {
    return this.tipoVehiculoService.create(createTipoVehiculoDto);
  }

  @ApiOperation({ summary: 'Obtener todos los tipos de vehículo' })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de vehículo obtenida correctamente',
    type: [TipoVehiculoDto],
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron tipos de vehículo',
  })
  @Get()
  async findAll(): Promise<TipoVehiculo[]> {
    return this.tipoVehiculoService.findAll();
  }

  @ApiOperation({ summary: 'Obtener un tipo de vehículo por ID' })
  @ApiResponse({
    status: 200,
    description: 'Tipo de vehículo obtenido correctamente',
    type: TipoVehiculoDto,
  })
  @ApiResponse({ status: 404, description: 'Tipo de vehículo no encontrado' })
  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string): Promise<TipoVehiculo> {
    return this.tipoVehiculoService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar un tipo de vehículo' })
  @ApiResponse({
    status: 200,
    description: 'Tipo de vehículo actualizado correctamente',
    type: TipoVehiculoDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos para actualizar un tipo de vehículo',
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de vehículo no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un tipo de vehículo con ese nombre',
  })
  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body(EmptyObjectPipe)
    updateTipoVehiculoDto: UpdateTipoVehiculoDto,
  ) {
    return this.tipoVehiculoService.update(id, updateTipoVehiculoDto);
  }

  @ApiOperation({ summary: 'Eliminar un tipo de vehículo por ID' })
  @ApiResponse({
    status: 200,
    description: 'Tipo de vehículo eliminado correctamente',
  })
  @ApiResponse({ status: 404, description: 'Tipo de vehículo no encontrado' })
  @ApiResponse({
    status: 409,
    description: 'El tipo de vehiculo está en uso y no puede ser eliminado',
  })
  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.tipoVehiculoService.remove(id);
  }
}
