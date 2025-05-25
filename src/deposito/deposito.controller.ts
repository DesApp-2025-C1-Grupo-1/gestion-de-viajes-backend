import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DepositoService } from './deposito.service';
import { CreateDepositoDto } from './dto/create-deposito.dto';
import { UpdateDepositoDto } from './dto/update-deposito.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('deposito')
export class DepositoController {
  constructor(private readonly depositoService: DepositoService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un deposito' })
  @ApiResponse({ status: 201, description: 'Deposito creado correctamente' })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos para crear un deposito',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un Deposito con esa Longitud y Latitud',
  })
  create(@Body() createDepositoDto: CreateDepositoDto) {
    return this.depositoService.create(createDepositoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los deposito' })
  @ApiResponse({
    status: 200,
    description: 'Lista de deposito obtenida correctamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Error al obtener la lista de deposito',
  })
  findAll() {
    return this.depositoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un deposito por ID' })
  @ApiResponse({ status: 200, description: 'Deposito obtenido correctamente' })
  @ApiResponse({ status: 404, description: 'Deposito no encontrado' })
  findOne(@Param('id') id: string) {
    return this.depositoService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un deposito' })
  @ApiResponse({
    status: 200,
    description: 'Deposito actualizado correctamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos para actualizar un deposito',
  })
  @ApiResponse({ status: 404, description: 'Deposito no encontrado' })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un Deposito con esa Longitud y Latitud',
  })
  update(
    @Param('id') id: string,
    @Body() updateDepositoDto: UpdateDepositoDto,
  ) {
    return this.depositoService.update(id, updateDepositoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un deposito por ID' })
  @ApiResponse({ status: 200, description: 'Deposito eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'Deposito no encontrado' })
  remove(@Param('id') id: string) {
    return this.depositoService.remove(id);
  }
}
