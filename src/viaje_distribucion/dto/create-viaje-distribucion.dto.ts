import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
  IsInt,
  IsIn,
  IsNotEmpty,
} from 'class-validator';

export class CreateViajeDistribucionDto {
  @ApiProperty({ example: '2024-01-15T08:00:00.000Z' })
  @IsDateString()
  fecha_inicio: Date;

  @ApiProperty({ example: '64a123456789abcdef012345' })
  @IsMongoId()
  origen: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['nacional', 'internacional'])
  @ApiProperty({
    description: 'Tipo de viaje',
    example: 'Nacional / Internacional',
  })
  tipo_viaje: string;

  @ApiProperty({ example: '64a123456789abcdef012346' })
  @IsMongoId()
  chofer: string;

  @ApiProperty({ example: '64a123456789abcdef012347' })
  @IsMongoId()
  transportista: string;

  @ApiProperty({ example: '64a123456789abcdef012348' })
  @IsMongoId()
  vehiculo: string;

  @ApiProperty({ example: [1, 2] })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsInt({ each: true })
  remito_ids: number[];

  @ApiProperty({ example: 125 })
  @IsInt()
  kilometros: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsInt()
  tarifa_id?: number;

  @ApiProperty({
    enum: ['iniciado', 'cargando', 'cargado', 'finalizado'],
    example: 'iniciado',
    required: false,
  })
  @IsOptional()
  @IsEnum(['iniciado', 'cargando', 'cargado', 'finalizado'])
  estado?: string;

  @ApiProperty({ example: 'Viaje de distribución urgente', required: false })
  @IsOptional()
  @IsString()
  observaciones?: string;
}
