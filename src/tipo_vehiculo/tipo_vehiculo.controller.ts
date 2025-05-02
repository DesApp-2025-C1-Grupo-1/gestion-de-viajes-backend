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

@Controller('tipo-vehiculo')
export class TipoVehiculoController {
  constructor(private readonly tipoVehiculoService: TipoVehiculoService) {}

  @Post()
  create(@Body() createTipoVehiculoDto: CreateTipoVehiculoDto) {
    return this.tipoVehiculoService.create(createTipoVehiculoDto);
  }

  @Get()
  findAll() {
    return this.tipoVehiculoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoVehiculoService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTipoVehiculoDto: UpdateTipoVehiculoDto,
  ) {
    return this.tipoVehiculoService.update(+id, updateTipoVehiculoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoVehiculoService.remove(+id);
  }
}
