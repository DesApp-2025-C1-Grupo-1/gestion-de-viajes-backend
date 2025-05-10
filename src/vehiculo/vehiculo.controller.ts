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

@Controller('vehiculo')
export class VehiculoController {
  constructor(private readonly vehiculoService: VehiculoService) {}

  @Post()
  async create(
    @Body(ValidateTipoVehiculoExistsPipe) createVehiculoDto: CreateVehiculoDto,
  ) {
    return this.vehiculoService.create(createVehiculoDto);
  }

  @Get()
  async findAll() {
    return this.vehiculoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.vehiculoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body(EmptyObjectPipe, ValidateTipoVehiculoExistsPipe)
    updateVehiculoDto: UpdateVehiculoDto,
  ) {
    return this.vehiculoService.update(id, updateVehiculoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.vehiculoService.remove(id);
  }
}
