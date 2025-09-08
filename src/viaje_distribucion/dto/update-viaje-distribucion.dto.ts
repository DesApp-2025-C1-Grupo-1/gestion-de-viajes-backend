import { PartialType } from '@nestjs/swagger';
import { CreateViajeDistribucionDto } from './create-viaje-distribucion.dto';

export class UpdateViajeDistribucionDto extends PartialType(
  CreateViajeDistribucionDto,
) {}
