import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  NotFoundException,
  Patch,
} from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { Empresa } from './schemas/empresa.schema';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { EmptyObjectPipe } from 'src/common/pipes/empty_object.pipe';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';

@Controller('empresa')
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) {}

  @ApiOperation({ summary: 'Obtener todas las empresas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de empresas obtenida correctamente',
    type: [Empresa],
  })
  @ApiResponse({ status: 404, description: 'No se encontraron empresas' })
  @Get()
  async findAll(): Promise<Empresa[]> {
    return this.empresaService.findAll();
  }

  @ApiOperation({ summary: 'Obtener una empresa por ID' })
  @ApiResponse({
    status: 200,
    description: 'Empresa obtenida correctamente',
    type: Empresa,
  })
  @ApiResponse({ status: 404, description: 'Empresa no encontrada' })
  @Get(':id')
  async findOne(@Param('id', ParseObjectIdPipe) id: string): Promise<Empresa> {
    const empresa = await this.empresaService.findOne(id);
    if (!empresa) throw new NotFoundException('Empresa not found');
    return empresa;
  }

  @ApiOperation({ summary: 'Crear una empresa' })
  @ApiResponse({
    status: 201,
    description: 'Empresa creada correctamente',
    type: Empresa,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos para crear una empresa',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe una empresa con ese CUIT',
  })
  @Post()
  async create(
    @Body(EmptyObjectPipe) createEmpresaDto: CreateEmpresaDto,
  ): Promise<Empresa> {
    return this.empresaService.create(createEmpresaDto);
  }

  @ApiOperation({ summary: 'Actualizar una empresa' })
  @ApiResponse({
    status: 200,
    description: 'Empresa actualizada correctamente',
    type: Empresa,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos para actualizar una empresa',
  })
  @ApiResponse({ status: 404, description: 'Empresa no encontrada' })
  @Patch(':id')
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body(EmptyObjectPipe) updateEmpresaDto: UpdateEmpresaDto,
  ): Promise<Empresa> {
    const updated = await this.empresaService.update(id, updateEmpresaDto);
    if (!updated) throw new NotFoundException('Empresa no encontrada');
    return updated;
  }

  @ApiOperation({ summary: 'Eliminar una empresa por ID' })
  @ApiResponse({ status: 200, description: 'Empresa eliminada correctamente' })
  @ApiResponse({ status: 404, description: 'Empresa no encontrada' })
  @ApiResponse({
    status: 409,
    description: 'La empresa está en uso y no puede ser eliminada', //Falta agregar todavía en todas las entidades
  })
  @Delete(':id')
  async delete(
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<{ deleted: boolean }> {
    const deleted = await this.empresaService.delete(id);
    if (!deleted) throw new NotFoundException('Empresa no encontrada');
    return { deleted };
  }
}
