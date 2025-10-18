import { ApiProperty } from '@nestjs/swagger';
import { ViajeDistribucionDto } from 'src/viaje_distribucion/dto/viaje-distribucion.dto';

export class EmpresaViajesDto {
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
    description: 'Cantidad de viajes',
    example: 15,
  })
  cantidadViajes: number;
}

export class EstadisticasRecientesDto {
  @ApiProperty({ example: 3, description: 'Cantidad de vehículos recientes' })
  vehiculos: number;

  @ApiProperty({ example: 2, description: 'Cantidad de choferes recientes' })
  choferes: number;

  @ApiProperty({ example: 1, description: 'Cantidad de empresas recientes' })
  empresas: number;

  @ApiProperty({
    example: '2023-05-20T00:00:00Z',
    description: 'Fecha desde la que se cuentan las estadísticas',
  })
  desde: Date;
}

export class DashboardResponseDto {
  @ApiProperty({
    type: [ViajeDistribucionDto],
    description: 'Próximos 5 viajes de distribución programados',
  })
  proximosViajes: ViajeDistribucionDto[];

  @ApiProperty({
    type: Number,
    description: 'Cantidad total de vehículos en el sistema',
    example: 15,
  })
  totalVehiculos: number;

  @ApiProperty({
    type: Number,
    description: 'Cantidad total de choferes en el sistema',
    example: 15,
  })
  totalChoferes: number;

  @ApiProperty({
    type: Number,
    description: 'Cantidad total de empresas en el sistema',
    example: 15,
  })
  totalEmpresas: number;

  @ApiProperty({
    type: [EmpresaViajesDto],
    description: 'Top empresas con más viajes',
  })
  topEmpresas: EmpresaViajesDto[];

  @ApiProperty({
    type: EstadisticasRecientesDto,
    description: 'Estadísticas recientes del sistema',
  })
  estadisticasRecientes: EstadisticasRecientesDto;
}
