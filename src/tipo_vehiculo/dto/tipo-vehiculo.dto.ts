import { ApiProperty } from '@nestjs/swagger';

export class TipoVehiculoDto {
  @ApiProperty({
    example: '665f0ec9fe1846d5a9f3baf2',
    description: 'ID del tipo de vehículo',
  })
  _id: string;

  @ApiProperty({
    example: 'Forgón',
    description: 'Nombre del tipo de vehículo',
  })
  nombre: string;

  @ApiProperty({
    example:
      'Vehículo de carga cerrado, con capacidad de carga de hasta 3 toneladas.',
    description: 'Descripción del tipo de vehículo',
  })
  descripcion: string;

  @ApiProperty({
    description: 'licencias permitidas según la clasificación nacional',
    example: 'C1',
    enum: [
      'A1.1',
      'A1.2',
      'A1.3',
      'A1.4',
      'A2.1',
      'A2.2',
      'A3',
      'B1',
      'B2',
      'C1',
      'C2',
      'C3',
      'D1',
      'D2',
      'D3',
      'D4',
      'E1',
      'E2',
      'F',
      'G1',
      'G2',
      'G3',
    ],
  })
  licencia_permitida: string;
}
