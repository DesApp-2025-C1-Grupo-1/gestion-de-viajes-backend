import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ViajeService } from './viaje.service';
import { CreateViajeDto } from './dto/create-viaje.dto';
import { UpdateViajeDto } from './dto/update-viaje.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ViajeDto } from './dto/viaje.dto';
import { ValidateEmpresaExistsPipe } from 'src/common/pipes/validate_Empresa_exists.pipe';
import { ValidateDepositoExistsPipe } from 'src/common/pipes/validate_Deposito_exists.pipe';
import { ValidateVehiculoExistsPipe } from 'src/common/pipes/validate_Vehiculo_exists.pipe';
import { TransformObjectIdFieldsPipe } from 'src/common/pipes/transform_objectId_fields.pipe';
import { ValidateChoferExistsPipe } from 'src/common/pipes/validate_Chofer_exists.pipe';

@Controller('viaje')
export class ViajeController {
  constructor(private readonly viajeService: ViajeService) {}

  @ApiOperation({ summary: 'Crear un viaje' })
  @ApiResponse({
    status: 201,
    description: 'Viaje creado correctamente',
    type: ViajeDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos para crear un viaje',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe una viaje con esa patente',
  })
  @Post()
  create(
    @Body(
      ValidateVehiculoExistsPipe,
      ValidateEmpresaExistsPipe,
      ValidateDepositoExistsPipe,
      ValidateChoferExistsPipe,
      new TransformObjectIdFieldsPipe([
        'deposito',
        'empresa',
        'vehiculo',
        'chofer',
      ]),
    )
    createViajeDto: CreateViajeDto,
  ) {
    return this.viajeService.create(createViajeDto);
  }

  @Get()
  findAll() {
    return this.viajeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.viajeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateViajeDto: UpdateViajeDto) {
    return this.viajeService.update(+id, updateViajeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.viajeService.remove(+id);
  }
}
