import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsDateString, IsIn } from 'class-validator';

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

  @ApiProperty({
    description: 'Id del chofer | Nombre del chofer',
    example: 'Juan Perez',
    required: false,
  })
  @IsOptional()
  @IsString()
  chofer?: string;

  @ApiProperty({
    description: 'Id del vehiculo | Patente del vehiculo',
    example: 'AB123CD',
    required: false,
  })
  @IsOptional()
  @IsString()
  vehiculo?: string;

  @ApiProperty({
    description: 'Tipo de viaje',
    example: 'nacional',
    enum: ['nacional', 'internacional'],
    required: false,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase() : undefined,
  )
  @IsIn(['nacional', 'internacional'])
  tipo?: string;

  @IsOptional()
  @IsString()
  origen?: string;

  @IsOptional()
  @IsString()
  destino?: string;
}
