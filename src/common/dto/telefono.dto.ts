import { ApiProperty } from '@nestjs/swagger';

export class TelefonoDto {
  @ApiProperty({
    example: '665f0ec9fe1846d5a9f3baf2',
    description: 'ID del teléfono',
  })
  _id: string;

  @ApiProperty({
    example: '+54',
    description: 'Código de país del teléfono',
  })
  codigo_pais: string;

  @ApiProperty({
    example: '11',
    description: 'Código de área del teléfono',
  })
  codigo_area: string;

  @ApiProperty({
    example: '12345678',
    description: 'Número de teléfono',
  })
  numero: string;
}
