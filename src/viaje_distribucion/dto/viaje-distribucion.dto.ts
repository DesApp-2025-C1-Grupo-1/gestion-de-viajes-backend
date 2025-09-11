import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

class RemitoInfoDto {
  @ApiProperty({ example: '64a123456789abcdef012345' })
  id: string;
}

class TarifaDto {
  id: number;
  nombre: string;
  valorBase: number;
  esVigente: boolean;
  transportistaNombre: string;
  tipoVehiculoNombre: string;
  zonaNombre: string;
  tipoCargaNombre: string;
  transportistaId: number;
  tipoVehiculoId: number;
  zonaId: number;
  tipoCargaId: number;
  total: number;
  adicionales: {
    id: number;
    adicional: {
      id: number;
      nombre: string;
      costoDefault: number;
      descripcion: string;
      activo: boolean;
      esGlobal: boolean;
    };
    costoEspecifico: number;
    activo: boolean;
  }[];
}

export class ViajeDistribucionDto {
  @ApiProperty({ example: '2024-01-15T08:00:00.000Z' })
  fecha_inicio: Date;

  @ApiProperty({ example: '2024-01-15T18:00:00.000Z' })
  fecha_llegada?: Date;

  @ApiProperty({ example: '64a123456789abcdef012345' })
  origen: Types.ObjectId;

  @ApiProperty({ example: '64a123456789abcdef012346' })
  chofer: Types.ObjectId;

  @ApiProperty({ example: '64a123456789abcdef012347' })
  transportista: Types.ObjectId;

  @ApiProperty({ example: '64a123456789abcdef012348' })
  vehiculo: Types.ObjectId;

  @ApiProperty({ example: [1, 2] })
  remito_ids: number[];

  @ApiProperty({ type: [RemitoInfoDto], required: false })
  @Type(() => RemitoInfoDto)
  remitos_info?: RemitoInfoDto[];

  @ApiProperty({ example: 1 })
  tarifa_id: number;

  @ApiProperty({ type: TarifaDto, required: false })
  tarifa?: TarifaDto;

  @ApiProperty({ enum: ['iniciado', 'cargando', 'cargado', 'finalizado'] })
  estado: string;

  @ApiProperty({ example: '2024-01-15T10:00:00.000Z' })
  createdAt: Date;
}
