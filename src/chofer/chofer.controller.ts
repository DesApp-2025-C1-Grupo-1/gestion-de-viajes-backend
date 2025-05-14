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

@Controller('chofer')
export class ChoferController {
  constructor(private readonly choferService: ChoferService) {}

  @ApiOperation({ summary: 'crear un chofer' })
  @ApiResponse({ status: 200, description: 'Empresa creada correctamente' })
  @ApiResponse({ status: 400, description: 'Error al crear una empresa ' })
  @Post()
  create(@Body() createChoferDto: CreateChoferDto) {
    return this.choferService.create(createChoferDto);
  }

  @ApiOperation({ summary: 'Obtener todos los choferes' })
  @ApiResponse({ status: 200, description: 'Empresas obtenidas correctamente' })
  @ApiResponse({ status: 400, description: 'Error al crear una empresa ' })
  @Get()
  findAll() {
    return this.choferService.findAll();
  }

  @ApiOperation({ summary: 'Obtener un chofer por ID' })
  @ApiResponse({ status: 200, description: 'Empresa obtenida correctamente' })
  @ApiResponse({ status: 400, description: 'Error al obtener una empresa ' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.choferService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar un chofer' })
  @ApiResponse({
    status: 200,
    description: 'Actualizacion correcta de empresa',
  })
  @ApiResponse({ status: 400, description: 'Error al actualizar una empresa ' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChoferDto: UpdateChoferDto) {
    return this.choferService.update(id, updateChoferDto);
  }

  @ApiOperation({ summary: 'Eliminar un chofer por ID' })
  @ApiResponse({ status: 200, description: 'Eliminacion correcta de empresa' })
  @ApiResponse({ status: 400, description: 'Error al eliminar una empresa ' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.choferService.remove(id);
  }
}
