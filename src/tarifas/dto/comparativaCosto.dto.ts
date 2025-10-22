import { ApiProperty } from '@nestjs/swagger';

export class ComparativaCostoDto {
  @ApiProperty({ description: 'Nombre de la zona' })
  nombre: string;

  @ApiProperty({ description: 'Promedio de tarifas de la zona', type: Number })
  average: number;

  @ApiProperty({
    description: 'Valor máximo de tarifas de la zona',
    type: Number,
  })
  max: number;
}
