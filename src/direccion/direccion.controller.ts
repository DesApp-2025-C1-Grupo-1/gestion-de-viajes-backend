import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DireccionService } from './direccion.service';
import { CreateDireccionDto } from './dto/create-direccion.dto';
import { UpdateDireccionDto } from './dto/update-direccion.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('direccion')
export class DireccionController {
  constructor(private readonly direccionService: DireccionService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una direccion' })
  @ApiResponse({ status: 201, description: 'Direccion creado correctamente' })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos para crear una direccion',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe una direccion con los mismos datos',
  })
  create(@Body() createDireccionDto: CreateDireccionDto) {
    return this.direccionService.create(createDireccionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las direcciones' })
  @ApiResponse({
    status: 200,
    description: 'Lista de direcciones obtenida correctamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Error al obtener la lista de direcion',
  })
  findAll() {
    return this.direccionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una direccion por ID' })
  @ApiResponse({ status: 200, description: 'Direccion obtenido correctamente' })
  @ApiResponse({ status: 404, description: 'Direccion no encontrada' })
  findOne(@Param('id') id: string) {
    return this.direccionService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Direccion actualizado correctamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos para actualizar un direccion',
  })
  @ApiResponse({ status: 404, description: 'Direccion no encontrada' })
  @ApiResponse({
    status: 409,
    description: 'Ya existe una direccion con los mismos datos',
  })
  update(
    @Param('id') id: string,
    @Body() updateDireccionDto: UpdateDireccionDto,
  ) {
    return this.direccionService.update(id, updateDireccionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una direccion por ID' })
  @ApiResponse({
    status: 200,
    description: 'Direccion eliminada correctamente',
  })
  @ApiResponse({ status: 404, description: 'Direccion no encontrada' })
  remove(@Param('id') id: string) {
    return this.direccionService.remove(id);
  }
}
