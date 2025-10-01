import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ChoferDto } from 'src/chofer/dto/chofer.dto';
import { DepositoDto } from 'src/deposito/dto/deposito.dto';
import { EmpresaDto } from 'src/empresa/dto/empresa.dto';
import { TarifaDto } from 'src/tarifas/dto/tarifa.dto';
import { VehiculoDto } from 'src/vehiculo/dto/vehiculo.dto';

class RemitoInfoDto {
  @ApiProperty({ example: '64a123456789abcdef012345' })
  id: string;
}

export class ViajeDistribucionDto {
  @ApiProperty({
    example: '665f0ec9fe1846d5a9f3baf2',
    description: 'ID del viaje',
  })
  _id?: string;

  @ApiProperty({ example: '2024-01-15T08:00:00.000Z' })
  fecha_inicio: Date;

  @ApiProperty({
    description: 'Tipo de viaje',
    example: 'Nacional / Internacional',
  })
  tipo_viaje: string;

  @ApiProperty({
    enum: ['iniciado', 'inicio de carga', 'fin de carga', 'fin de viaje'],
  })
  estado: string;

  @ApiProperty({ example: 125 })
  kilometros: number;

  @ApiProperty({ type: DepositoDto })
  origen: DepositoDto;

  @ApiProperty({ type: ChoferDto })
  chofer: ChoferDto;

  @ApiProperty({ type: EmpresaDto })
  transportista: EmpresaDto;

  @ApiProperty({ type: VehiculoDto })
  vehiculo: VehiculoDto;

  @ApiProperty({ example: [1, 2], type: [Number] })
  remito_ids: number[];

  @ApiProperty({ type: [RemitoInfoDto], required: false })
  @Type(() => RemitoInfoDto)
  remitos_info?: RemitoInfoDto[];

  @ApiProperty({ example: 1, required: false })
  tarifa_id?: number;

  @ApiProperty({ type: String, required: false })
  observaciones?: string;

  @ApiProperty({ type: TarifaDto, required: false })
  tarifa?: TarifaDto;

  @ApiProperty({ example: '2024-01-15T10:00:00.000Z' })
  createdAt: Date;
}
