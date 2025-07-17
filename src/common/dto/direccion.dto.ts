import { ApiProperty } from '@nestjs/swagger';

export class DireccionDto {
  @ApiProperty({
    example: '665f0ec9fe1846d5a9f3baf2',
    description: 'ID de la dirección',
  })
  _id: string;

  @ApiProperty({
    example: 'Av. Siempre Viva 123',
    description: 'Calle y número de la dirección',
  })
  calle: string;

  @ApiProperty({
    example: '123',
    description: 'Numero de la dirección',
  })
  numero: string;

  @ApiProperty({
    example: 'Springfield',
    description: 'Ciudad de la dirección',
  })
  ciudad: string;

  @ApiProperty({
    example: 'Estado de Springfield',
    description: 'Estado de la dirección',
  })
  estado_provincia: string;

  @ApiProperty({
    example: 'Argentina',
    description: 'País de la dirección',
  })
  pais: string;

  @ApiProperty({
    example: 'domicilio fiscal',
    description: 'Tipo de dirección',
  })
  tipo: string;
}
