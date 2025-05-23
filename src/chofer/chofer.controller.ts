import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChoferService } from './chofer.service';
import { CreateChoferDto } from './dto/create-chofer.dto';
import { UpdateChoferDto } from './dto/update-chofer.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { EmptyObjectPipe } from 'src/common/pipes/empty_object.pipe';
import { ValidateEmpresaExistsPipe } from 'src/common/pipes/validate_Empresa_exists.pipe';
import { ValidateVehiculoExistsPipe } from 'src/common/pipes/validate_Vehiculo_exists.pipe';
import { TransformObjectIdFieldsPipe } from 'src/common/pipes/transform_objectId_fields.pipe';
import { ChoferDto } from './dto/chofer.dto';

@Controller('chofer')
export class ChoferController {
  constructor(private readonly choferService: ChoferService) {}

  @ApiOperation({ summary: 'Crear un chofer' })
  @ApiResponse({
    status: 201,
    description: 'Chofer creado correctamente',
    type: ChoferDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos para crear un chofer',
  })
  @Post()
  create(
    @Body(
      ValidateVehiculoExistsPipe,
      ValidateEmpresaExistsPipe,
      new TransformObjectIdFieldsPipe(['vehiculo', 'empresa']),
    )
    createChoferDto: CreateChoferDto,
  ) {
    return this.choferService.create(createChoferDto);
  }

  @ApiOperation({ summary: 'Obtener todos los choferes' })
  @ApiResponse({
    status: 200,
    description: 'Lista de choferes obtenida correctamente',
    type: [ChoferDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Error al obtener la lista de choferes',
  })
  @Get()
  findAll() {
    return this.choferService.findAll();
  }

  @ApiOperation({ summary: 'Obtener un chofer por ID' })
  @ApiResponse({
    status: 200,
    description: 'Chofer obtenido correctamente',
    type: ChoferDto,
  })
  @ApiResponse({ status: 404, description: 'Chofer no encontrado' })
  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.choferService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar un chofer' })
  @ApiResponse({
    status: 200,
    description: 'Chofer actualizado correctamente',
    type: ChoferDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos para actualizar un chofer',
  })
  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body(
      EmptyObjectPipe,
      ValidateVehiculoExistsPipe,
      ValidateEmpresaExistsPipe,
      new TransformObjectIdFieldsPipe(['vehiculo', 'empresa']),
    )
    updateChoferDto: UpdateChoferDto,
  ) {
    return this.choferService.update(id, updateChoferDto);
  }

  @ApiOperation({ summary: 'Eliminar un chofer por ID' })
  @ApiResponse({ status: 200, description: 'Chofer eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'Chofer no encontrado' })
  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.choferService.remove(id);
  }
}
