import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsIn, IsOptional, IsString } from 'class-validator';

export class BuscarViajeDistribucionDto {
  @ApiProperty({
    description:
      'Fecha de desde la cual se empieza a filtrar el viaje en formato ISO 8601',
    example: '2025-06-01T08:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  fecha_desde?: Date;

  @ApiProperty({
    description:
      'Fecha hasta la cual se empieza a filtrar el viaje en formato ISO 8601',
    example: '2025-07-02T08:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  fecha_hasta?: Date;

  @ApiProperty({
    description: 'ID del viaje | ID parcial del viaje',
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
  transportista?: string;

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

  @ApiProperty({
    description: 'Id del deposito de origen',
    example: '68401e9fbe131552ca804955',
    required: false,
  })
  @IsOptional()
  @IsString()
  origen?: string;

  @ApiProperty({
    description: 'Lista de remitos',
    example: [1, 2, 3],
    required: false,
  })
  @IsOptional()
  remito?: number[];

  @ApiProperty({
    description: 'Id de la tarifa',
    example: 1,
    required: false,
  })
  @IsOptional()
  tarifa?: number;

  @ApiProperty({
    description: 'Estado del viaje',
    example: "inicio de carga",
    required: false,
  })
  @IsOptional()
  @IsString()
  estado?:  string;
}
