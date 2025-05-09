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

@Controller('tipo_vehiculo')
export class TipoVehiculoController {
  constructor(private readonly tipoVehiculoService: TipoVehiculoService) {}

  @Post()
  create(
    @Body() createTipoVehiculoDto: CreateTipoVehiculoDto,
  ): Promise<TipoVehiculo> {
    return this.tipoVehiculoService.create(createTipoVehiculoDto);
  }

  @Get()
  async findAll(): Promise<TipoVehiculo[]> {
    return this.tipoVehiculoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string): Promise<TipoVehiculo> {
    return this.tipoVehiculoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(EmptyObjectPipe, ParseObjectIdPipe)
    updateTipoVehiculoDto: UpdateTipoVehiculoDto,
  ) {
    return this.tipoVehiculoService.update(id, updateTipoVehiculoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.tipoVehiculoService.remove(id);
  }
}
