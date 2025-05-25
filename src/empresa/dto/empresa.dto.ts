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

  @ApiProperty({
    description: 'Id de la dirección',
    example: '665f0ec9fe1846d5a9f3baf2',
  })
  domicilio_fiscal: DireccionDto;

  @ApiProperty({
    description: 'Teléfono de contacto',
    example: '+541234567890',
  })
  telefono: string;

  @ApiProperty({
    description: 'Correo electrónico',
    example: 'info@empresa.com',
  })
  mail: string;

  @ApiProperty({
    description: 'ID del contacto',
    example: '665f0ec9fe1846d5a9f3baf2',
  })
  nombre_contacto: ContactoDto;
}
