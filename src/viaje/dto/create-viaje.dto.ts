import {
  IsDateString,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateViajeDto {
  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Fecha y hora de inicio del viaje',
    example: '2025-06-01T08:00:00Z',
  })
  fecha_inicio: Date;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Fecha y hora estimada de llegada',
    example: '2025-06-01T18:00:00Z',
  })
  fecha_llegada: Date;

  @IsString()
  @IsNotEmpty()
  @IsIn(['nacional', 'internacional'])
  @ApiProperty({
    description: 'Tipo de viaje',
    example: 'Nacional / Internacional',
  })
  tipo_viaje: string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ID del depósito de origen',
    example: '665f0f02fe1846d5a9f3baf3',
  })
  deposito_origen: string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ID del depósito de destino',
    example: '665f0f02fe1846d5a9f3baf4',
  })
  deposito_destino: string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ID de la empresa',
    example: '665f0f02fe1846d5a9f3baf5',
  })
  empresa: string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ID del chofer',
    example: '665f0f02fe1846d5a9f3baf6',
  })
  chofer: string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ID del vehículo',
    example: '665f0f02fe1846d5a9f3baf7',
  })
  vehiculo: string;
}
