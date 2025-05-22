import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VehiculoService } from './vehiculo.service';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { EmptyObjectPipe } from 'src/common/pipes/empty_object.pipe';
import { ValidateTipoVehiculoExistsPipe } from 'src/common/pipes/validate_TipoVehiculo_exists.pipe';
import { ValidateEmpresaExistsPipe } from 'src/common/pipes/validate_Empresa_exists.pipe';
import { TransformObjectIdFieldsPipe } from 'src/common/pipes/transform_objectId_fields.pipe';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('vehiculo')
export class VehiculoController {
  constructor(private readonly vehiculoService: VehiculoService) {}

  @ApiOperation({ summary: 'Crear un vehículo' })
  @ApiResponse({ status: 201, description: 'Vehículo creado correctamente' })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos para crear un vehículo',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe una Vehículo con esa patente',
  })
  @Post()
  async create(
    @Body(
      ValidateTipoVehiculoExistsPipe,
      ValidateEmpresaExistsPipe,
      new TransformObjectIdFieldsPipe(['tipo', 'empresa']),
    )
    createVehiculoDto: CreateVehiculoDto,
  ) {
    return this.vehiculoService.create(createVehiculoDto);
  }

  @ApiOperation({ summary: 'Obtener todos los vehículos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de vehículos obtenida correctamente',
  })
  @ApiResponse({ status: 404, description: 'No se encontraron vehículos' })
  @Get()
  async findAll() {
    return this.vehiculoService.findAll();
  }

  @ApiOperation({ summary: 'Obtener un vehículo por ID' })
  @ApiResponse({ status: 200, description: 'Vehículo obtenido correctamente' })
  @ApiResponse({ status: 404, description: 'Vehículo no encontrado' })
  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.vehiculoService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar un vehículo' })
  @ApiResponse({
    status: 200,
    description: 'Vehículo actualizado correctamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos para actualizar un vehículo',
  })
  @ApiResponse({
    status: 404,
    description: 'Vehículo no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe una Vehículo con esa patente',
  })
  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body(
      EmptyObjectPipe,
      ValidateTipoVehiculoExistsPipe,
      ValidateEmpresaExistsPipe,
      new TransformObjectIdFieldsPipe(['tipo', 'empresa']),
    )
    updateVehiculoDto: UpdateVehiculoDto,
  ) {
    return this.vehiculoService.update(id, updateVehiculoDto);
  }

  @ApiOperation({ summary: 'Eliminar un vehículo por ID' })
  @ApiResponse({ status: 200, description: 'Vehículo eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'Vehículo no encontrado' })
  @ApiResponse({
    status: 409,
    description: 'El vehículo está en uso y no puede ser eliminado', //Falta agregar todavía en todas las entidades
  })
  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.vehiculoService.remove(id);
  }
}
