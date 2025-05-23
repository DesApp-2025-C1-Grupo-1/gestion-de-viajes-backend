import { ApiProperty } from '@nestjs/swagger';

export class TipoVehiculoDto {
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
}
