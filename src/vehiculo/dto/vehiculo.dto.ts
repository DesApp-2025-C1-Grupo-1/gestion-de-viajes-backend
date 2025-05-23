import { ApiProperty } from '@nestjs/swagger';
import { CreateEmpresaDto } from 'src/empresa/dto/create-empresa.dto';
import { TipoVehiculoDto } from 'src/tipo_vehiculo/dto/tipo-vehiculo.dto';

export class VehiculoDto {
  @ApiProperty({
    example: '665f0ec9fe1846d5a9f3baf2',
    description: 'ID del vehículo',
  })
  _id: string;

  @ApiProperty({
    example: 'ABC123',
    description: 'Patente del vehículo (formato válido: ABC123 o AB123CD)',
  })
  readonly patente: string;

  @ApiProperty({
    example: 'Toyota',
    description: 'Marca del vehículo',
  })
  readonly marca: string;

  @ApiProperty({
    example: 'Hilux',
    description: 'Modelo del vehículo',
  })
  readonly modelo: string;

  @ApiProperty({
    example: 2020,
    description: 'Año de fabricación (entre 1900 y el año actual)',
    minimum: 1900,
    maximum: new Date().getFullYear(),
  })
  readonly año: number;

  @ApiProperty({
    example: 15.5,
    description: 'Volumen máximo de carga en m³',
    minimum: 0.01,
  })
  readonly volumen_carga: number;

  @ApiProperty({
    example: 1200,
    description: 'Peso máximo de carga en kilogramos',
    minimum: 0.01,
  })
  readonly peso_carga: number;

  @ApiProperty({
    example: '665f0ec9fe1846d5a9f3baf2',
    description: 'ID del tipo de vehículo (referencia a tipoVehiculo)',
    type: TipoVehiculoDto,
  })
  readonly tipo: TipoVehiculoDto;

  @ApiProperty({
    example: '665f0f02fe1846d5a9f3baf3',
    description: 'ID de la empresa a la que pertenece el vehículo',
    type: CreateEmpresaDto,
  })
  readonly empresa: CreateEmpresaDto;
}
