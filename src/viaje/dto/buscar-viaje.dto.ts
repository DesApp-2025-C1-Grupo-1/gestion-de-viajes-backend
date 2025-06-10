import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString } from 'class-validator';

export class BuscarViajeDto {
  @ApiProperty({
    description: 'Fecha de inicio del viaje en formato ISO 8601',
    example: '2025-06-01T08:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  fecha_inicio?: Date;

  @ApiProperty({
    description: 'Fecha de llegada del viaje en formato ISO 8601',
    example: '2025-06-01T18:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  fecha_llegada?: Date;

  @ApiProperty({
    description: 'ID del viaje',
    example: '665f0ec9fe1846d5a9f3baf2',
    required: false,
  })
  @IsOptional()
  @IsString()
  _id?: string;

  @ApiProperty({
    description:
      'Id de la empresa | Razon social de la empresa | nombre comercial de la empresa',
    example: 'Empresa XYZ',
    required: false,
  })
  @IsOptional()
  @IsString()
  empresa?: string;
}
