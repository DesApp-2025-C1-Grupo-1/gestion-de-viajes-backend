import { IsOptional, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class QueryPaginacionDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Número de página para la paginación',
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Cantidad de registros a devolver en la paginación',
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit?: number;
}
