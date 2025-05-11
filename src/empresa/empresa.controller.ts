import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException } from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { Empresa } from './schemas/empresa.schema';

@Controller('empresa')
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) {}

  @Get()
  async findAll(): Promise<Empresa[]> {
    return this.empresaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Empresa> {
    const empresa = await this.empresaService.findOne(id);
    if (!empresa) throw new NotFoundException('Empresa not found');
    return empresa;
  }

  @Post()
  async create(@Body() empresa: Empresa): Promise<Empresa> {
    return this.empresaService.create(empresa);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() empresa: Empresa): Promise<Empresa> {
    const updated = await this.empresaService.update(id, empresa);
    if (!updated) throw new NotFoundException('Empresa not found');
    return updated;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ deleted: boolean }> {
    const deleted = await this.empresaService.delete(id);
    if (!deleted) throw new NotFoundException('Empresa not found');
    return { deleted };
  }
} 