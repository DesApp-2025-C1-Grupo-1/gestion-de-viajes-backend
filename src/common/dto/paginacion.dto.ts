import { IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PaginacionDto {
  @ApiProperty({
    example: '10',
    description: 'Cuantos registros se deben omitir para la paginación',
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number;

  @ApiProperty({
    example: '6',
    description: 'Cuantos registros se deben devolver en la paginación',
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit?: number;
}
