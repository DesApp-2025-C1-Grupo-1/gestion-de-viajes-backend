import { ApiProperty } from '@nestjs/swagger';
import { ContactoDto } from 'src/common/dto/contacto.dto';
import { DireccionDto } from 'src/common/dto/direccion.dto';

export class EmpresaDto {
  @ApiProperty({
    description: 'ID de la empresa',
    example: 1,
  })
  _id: string;

  @ApiProperty({
    description: 'Razón social de la empresa',
    example: 'Transporte S.A.',
  })
  razon_social: string;

  @ApiProperty({
    description: 'Nombre comercial de la empresa',
    example: 'Transporte Rápido',
  })
  nombre_comercial: string;

  @ApiProperty({
    description: 'CUIT de la empresa (único)',
    example: 30712345678,
  })
  cuit: string;

  @ApiProperty({ type: DireccionDto })
  direccion: DireccionDto;

  @ApiProperty({ type: ContactoDto })
  contacto: ContactoDto;
}
