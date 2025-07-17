import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoVehiculoDto } from './create-tipo_vehiculo.dto';

export class UpdateTipoVehiculoDto extends PartialType(CreateTipoVehiculoDto) {}
