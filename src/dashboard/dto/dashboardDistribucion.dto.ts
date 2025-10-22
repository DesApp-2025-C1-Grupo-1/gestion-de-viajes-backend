import { ApiProperty } from '@nestjs/swagger';
import { ViajeDistribucionDto } from 'src/viaje_distribucion/dto/viaje-distribucion.dto';

export class EmpresaViajesDistribucionDto {
  @ApiProperty({
    description: 'ID de la empresa',
    example: '665f0f02fe1846d5a9f3baf5',
  })
  empresaId: string;

  @ApiProperty({
    description: 'Nombre de la empresa',
    example: 'Transportes S.A.',
  })
  nombre: string;

  @ApiProperty({
    description: 'Cantidad total de viajes realizados por la empresa',
    example: 15,
  })
  cantidadViajes: number;
}

export class DashboardDistribucionResponseDto {
  @ApiProperty({
    type: [ViajeDistribucionDto],
    description: 'Próximos viajes de distribución programados (limitado a 5)',
  })
  proximosViajes: ViajeDistribucionDto[];

  @ApiProperty({
    type: Number,
    description: 'Viajes actualmente en camino',
  })
  viajesEnCamino: number;

  @ApiProperty({
    type: [ViajeDistribucionDto],
    description: 'Viajes recientes realizados en la última semana',
  })
  viajesRecientes: ViajeDistribucionDto[];

  @ApiProperty({
    type: [EmpresaViajesDistribucionDto],
    description: 'Top empresas con más viajes realizados',
  })
  topEmpresas: EmpresaViajesDistribucionDto[];
}
