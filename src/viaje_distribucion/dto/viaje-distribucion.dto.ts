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
  @ApiProperty({
    example: '665f0ec9fe1846d5a9f3baf2',
    description: 'ID del viaje',
  })
  _id?: string;

  @ApiProperty({ example: '2024-01-15T08:00:00.000Z' })
  fecha_inicio: Date;

  @ApiProperty({ example: '64a123456789abcdef012345' })
  origen: Types.ObjectId;

  @ApiProperty({
    description: 'Tipo de viaje',
    example: 'Nacional / Internacional',
  })
  tipo_viaje: string;

  @ApiProperty({ example: '64a123456789abcdef012346' })
  chofer: Types.ObjectId;

  @ApiProperty({ example: '64a123456789abcdef012347' })
  transportista: Types.ObjectId;

  @ApiProperty({ example: '64a123456789abcdef012348' })
  vehiculo: Types.ObjectId;

  @ApiProperty({ example: [1, 2], type: [Number] })
  remito_ids: number[];

  @ApiProperty({ example: 125 })
  kilometros: number;

  @ApiProperty({ type: [RemitoInfoDto], required: false })
  @Type(() => RemitoInfoDto)
  remitos_info?: RemitoInfoDto[];

  @ApiProperty({ example: 1, required: false })
  tarifa_id?: number;

  @ApiProperty({ type: TarifaDto, required: false })
  tarifa?: TarifaDto;

  @ApiProperty({
    enum: ['iniciado', 'inicio de carga', 'fin de carga', 'fin de viaje'],
  })
  estado: string;

  @ApiProperty({ example: '2024-01-15T10:00:00.000Z' })
  createdAt: Date;
}
