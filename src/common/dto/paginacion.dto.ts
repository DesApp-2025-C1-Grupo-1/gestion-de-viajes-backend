import { IsNumber, IsOptional, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginacionDto {
  @ApiProperty({
    example: '10',
    description: 'Cuantos registros se deben omitir para la paginación',
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  skip: number;

  @ApiProperty({
    example: '6',
    description: 'Cuantos registros se deben devolver en la paginación',
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  limit: number;
}
