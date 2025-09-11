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
} from 'class-validator';

export class CreateViajeDistribucionDto {
  @ApiProperty({ example: '2024-01-15T08:00:00.000Z' })
  @IsDateString()
  fecha_inicio: Date;

  @ApiProperty({ example: '2024-01-15T18:00:00.000Z', required: false })
  @IsOptional()
  @IsDateString()
  fecha_llegada?: Date;

  @ApiProperty({ example: '64a123456789abcdef012345' })
  @IsMongoId()
  origen: string;

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

  @ApiProperty({ example: 1 })
  @IsInt()
  tarifa_id: number;

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
