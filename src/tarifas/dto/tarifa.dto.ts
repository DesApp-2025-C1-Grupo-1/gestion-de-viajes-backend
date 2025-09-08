import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AdicionalDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  id: number;

  @ApiProperty({ example: 'Estadia', description: 'Nombre del adicional' })
  @IsString()
  nombre: string;

  @ApiProperty({ example: 4000, description: 'Costo por defecto del adicional' })
  @IsInt()
  costoDefault: number;

  @ApiProperty({ example: '2 noches' })
  @IsString()
  descripcion: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  activo: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  esGlobal: boolean;

  @ApiProperty({ example: 4000 })
  @IsInt()
  costoEspecifico: number;
}

export class TarifaDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  id: number;

  @ApiProperty({ example: 'Tarifa 2' })
  @IsString()
  nombre: string;

  @ApiProperty({ example: 30000 })
  @IsInt()
  valorBase: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  esVigente: boolean;

  @ApiProperty({ example: 'Oca' })
  @IsString()
  transportistaNombre: string;

  @ApiProperty({ example: 'Camión' })
  @IsString()
  tipoVehiculoNombre: string;

  @ApiProperty({ example: 'Ituzaingó' })
  @IsString()
  zonaNombre: string;

  @ApiProperty({ example: 'Madera' })
  @IsString()
  tipoCargaNombre: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  transportistaId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  tipoVehiculoId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  zonaId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  tipoCargaId: number;

  @ApiProperty({ example: 34000 })
  @IsInt()
  total: number;

  @ApiProperty({ type: [AdicionalDto] })
  @ValidateNested({ each: true })
  @Type(() => AdicionalDto)
  adicionales: AdicionalDto[];
}