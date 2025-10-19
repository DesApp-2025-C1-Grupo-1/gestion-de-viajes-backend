import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class AdicionalDetalleDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  id: number;

  @ApiProperty({ example: 'Peon', description: 'Nombre del adicional' })
  @IsString()
  nombre: string;

  @ApiProperty({
    example: 35000,
    description: 'Costo por defecto del adicional',
  })
  @IsInt()
  costoDefault: number;

  @ApiProperty({ example: 'Peon ayudante' })
  @IsString()
  descripcion: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  activo: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  esGlobal: boolean;
}

export class AdicionalDto {
  @ApiProperty({ type: AdicionalDetalleDto })
  @ValidateNested()
  @Type(() => AdicionalDetalleDto)
  adicional: AdicionalDetalleDto;

  @ApiProperty({
    example: 35000,
    description: 'Costo específico del adicional para esta tarifa',
  })
  @IsInt()
  costoEspecifico: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  activo: boolean;
}

export class TarifaDto {
  @ApiProperty({ example: 4 })
  @IsInt()
  id: number;

  @ApiProperty({ example: 'Tarifa-001' })
  @IsString()
  nombreTarifa: string;

  @ApiProperty({ example: 2500 })
  @IsInt()
  valorBase: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  esVigente: boolean;

  @ApiProperty({ example: 'Acme logistica' })
  @IsString()
  transportistaNombre: string;

  @ApiProperty({ example: 'Camión Chasis' })
  @IsString()
  tipoVehiculoNombre: string;

  @ApiProperty({ example: 'GBA Oeste' })
  @IsString()
  zonaNombre: string;

  @ApiProperty({ example: 'Carga ligera' })
  @IsString()
  tipoCargaNombre: string;

  @ApiProperty({ example: '683f7e044904b1a84fc05249' })
  @IsString()
  transportistaId: string;

  @ApiProperty({ example: '683f7d734904b1a84fc0523b' })
  @IsString()
  tipoVehiculoId: string;

  @ApiProperty({ example: 46 })
  @IsInt()
  zonaId: number;

  @ApiProperty({ example: 3 })
  @IsInt()
  tipoCargaId: number;

  @ApiProperty({ example: 37500 })
  @IsInt()
  total: number;

  @ApiProperty({ type: [AdicionalDto] })
  @ValidateNested({ each: true })
  @Type(() => AdicionalDto)
  adicionales: AdicionalDto[];
}
