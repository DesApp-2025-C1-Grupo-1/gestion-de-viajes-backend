import { ApiProperty } from '@nestjs/swagger';
import { ViajeDto } from './viaje.dto';

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

export class DashboardResponseDto {
  @ApiProperty({
    type: [ViajeDto],
    description: 'Próximos 5 viajes programados',
  })
  proximosViajes: ViajeDto[];

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
    type: [EmpresaViajesDto],
    description: 'Top empresas con más viajes',
  })
  topEmpresas: EmpresaViajesDto[];
}
