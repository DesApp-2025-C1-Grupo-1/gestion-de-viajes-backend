import { ApiProperty } from '@nestjs/swagger';
import { ViajeDto } from 'src/viaje/dto/viaje.dto';

export class PaginacionDto {
  @ApiProperty({ type: [ViajeDto] })
  data: ViajeDto[];

  @ApiProperty({ example: 8 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;
}
