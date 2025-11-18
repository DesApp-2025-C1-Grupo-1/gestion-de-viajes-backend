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
import { Types } from 'mongoose';

export class CreateViajeDistribucionDto {
  @ApiProperty({ example: '2024-01-15T08:00:00.000Z' })
  @IsDateString()
  fecha_inicio: Date;

  @ApiProperty({ example: '64a123456789abcdef012345' })
  @IsMongoId()
  origen: Types.ObjectId;

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
  chofer: Types.ObjectId;

  @ApiProperty({ example: '64a123456789abcdef012347' })
  @IsMongoId()
  transportista: Types.ObjectId;

  @ApiProperty({ example: '64a123456789abcdef012348' })
  @IsMongoId()
  vehiculo: Types.ObjectId;

  @ApiProperty({ example: [1, 2], type: [Number] })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsInt({ each: true })
  remito_ids: number[];

  @ApiProperty({ example: 125 })
  @IsInt()
  kilometros: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  tarifa_id?: number;

  @ApiProperty({
    enum: ['iniciado', 'inicio de carga', 'fin de carga', 'fin de viaje'],
    example: 'iniciado',
    required: false,
  })
  @IsOptional()
  @IsEnum(['iniciado', 'inicio de carga', 'fin de carga', 'fin de viaje'])
  estado?: string;

  @ApiProperty({ example: 'Viaje de distribución urgente', required: false })
  @IsOptional()
  @IsString()
  observaciones?: string;
}
