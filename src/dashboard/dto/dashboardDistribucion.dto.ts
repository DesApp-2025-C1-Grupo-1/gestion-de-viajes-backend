import { ApiProperty } from '@nestjs/swagger';

export class ViajesPorEstadoDto {
  @ApiProperty({ example: 10, description: 'Cantidad de viajes iniciados' })
  iniciado: number;

  @ApiProperty({
    example: 5,
    description: 'Cantidad de viajes en inicio de carga',
  })
  inicioCarga: number;

  @ApiProperty({
    example: 3,
    description: 'Cantidad de viajes en fin de carga',
  })
  finCarga: number;

  @ApiProperty({
    example: 2,
    description: 'Cantidad de viajes en fin de viaje',
  })
  finViaje: number;
}

export class RemitosPorEstadoDto {
  @ApiProperty({ example: 12, description: 'Cantidad de remitos en camino' })
  enCamino: number;

  @ApiProperty({ example: 20, description: 'Cantidad de remitos entregados' })
  entregados: number;

  @ApiProperty({ example: 5, description: 'Cantidad de remitos no entregados' })
  noEntregados: number;
}

export class ProximoViajeDto {
  @ApiProperty({
    example: '652a1f5c8d1b2a3e4f567890',
    description: 'ID del viaje',
  })
  _id: string;

  @ApiProperty({ example: 'V-ABCDE', description: 'Número de viaje' })
  nro_viaje: string;

  @ApiProperty({
    example: '2024-01-15T08:00:00.000Z',
    description: 'Fecha de inicio del viaje',
  })
  fecha: Date;

  @ApiProperty({
    example: 'Transporte Rápido',
    description: 'Nombre comercial de la empresa transportista',
  })
  empresa: string;

  @ApiProperty({ example: 'Juan Perez', description: 'Nombre del chofer' })
  chofer: string;

  @ApiProperty({
    example: 37500,
    description: 'Valor de la tarifa si existe',
    required: false,
  })
  valorTarifa?: number;

  @ApiProperty({
    example: 2,
    description: 'Cantidad total de remitos asignados al viaje',
  })
  totalRemitos: number;

  @ApiProperty({
    example: 1,
    description: 'Cantidad de remitos entregados del viaje',
  })
  remitosEntregados: number;
}

export class DashboardDistribucionResponseDto {
  @ApiProperty({ example: 20, description: 'Cantidad total de viajes' })
  totalViajes: number;

  @ApiProperty({
    type: ViajesPorEstadoDto,
    description: 'Cantidad de viajes por estado',
  })
  viajesPorEstado: ViajesPorEstadoDto;

  @ApiProperty({ example: 37, description: 'Cantidad total de remitos' })
  totalRemitos: number;

  @ApiProperty({
    type: RemitosPorEstadoDto,
    description: 'Cantidad de remitos por estado',
  })
  remitosPorEstado: RemitosPorEstadoDto;

  @ApiProperty({
    type: [ProximoViajeDto],
    description: 'Lista de próximos viajes con información relevante',
  })
  proximosViajes: ProximoViajeDto[];
}
