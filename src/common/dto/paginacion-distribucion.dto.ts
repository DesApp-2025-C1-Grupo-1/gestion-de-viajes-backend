import { ApiProperty } from '@nestjs/swagger';
import { ViajeDistribucionDto } from 'src/viaje_distribucion/dto/viaje-distribucion.dto';

export class PaginacionDistribucionDto {
  @ApiProperty({ type: [ViajeDistribucionDto] })
  data: ViajeDistribucionDto[];

  @ApiProperty({ example: 8 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;
}
