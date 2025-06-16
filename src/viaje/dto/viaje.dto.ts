import { ApiProperty } from '@nestjs/swagger';
import { ChoferDto } from 'src/chofer/dto/chofer.dto';
import { DepositoDto } from 'src/deposito/dto/deposito.dto';
import { EmpresaDto } from 'src/empresa/dto/empresa.dto';
import { VehiculoDto } from 'src/vehiculo/dto/vehiculo.dto';

export class ViajeDto {
  @ApiProperty({
    example: '665f0ec9fe1846d5a9f3baf2',
    description: 'ID del viaje',
  })
  _id: string;

  @ApiProperty({
    description: 'Fecha y hora de inicio del viaje',
    example: '2025-06-01T08:00:00Z',
  })
  readonly fecha_inicio: Date;

  @ApiProperty({
    description: 'Fecha y hora estimada de llegada',
    example: '2025-06-01T18:00:00Z',
  })
  readonly fecha_llegada_estimada: Date;

  @ApiProperty({
    description: 'Fecha y hora de llegada',
    example: '2025-06-01T18:00:00Z',
  })
  readonly fecha_llegada: Date;

  @ApiProperty({
    description: 'Tipo de viaje',
    example: 'Nacional / Internacional',
  })
  readonly tipo_viaje: string;

  @ApiProperty({
    description: 'ID del depósito de origen',
    example: '665f0f02fe1846d5a9f3baf3',
  })
  readonly deposito_origen: DepositoDto;

  @ApiProperty({
    description: 'ID del depósito de destino',
    example: '665f0f02fe1846d5a9f3baf4',
  })
  readonly deposito_destino: DepositoDto;

  @ApiProperty({
    description: 'ID de la empresa',
    example: '665f0f02fe1846d5a9f3baf5',
  })
  readonly empresa: EmpresaDto;

  @ApiProperty({
    description: 'ID del chofer',
    example: '665f0f02fe1846d5a9f3baf6',
  })
  readonly chofer: ChoferDto;

  @ApiProperty({
    description: 'ID del vehículo',
    example: '665f0f02fe1846d5a9f3baf7',
  })
  readonly vehiculo: VehiculoDto;
}
