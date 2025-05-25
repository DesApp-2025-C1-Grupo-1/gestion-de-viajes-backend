import { ApiProperty } from '@nestjs/swagger';
import { TelefonoDto } from './telefono.dto';

export class ContactoDto {
  @ApiProperty({
    example: '665f0ec9fe1846d5a9f3baf2',
    description: 'ID del contacto',
  })
  _id: string;

  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre del contacto',
  })
  nombre: string;

  @ApiProperty({
    example: 'Pérez Juan',
    description: 'Apellido del contacto',
  })
  apellido: string;

  @ApiProperty({
    example: '665f0ec9fe1846d5a9f3baf2',
    description: 'ID Teléfono de contacto',
    type: TelefonoDto,
  })
  telefono: string;

  @ApiProperty({
    example: 'test@mail.com',
    description: 'Correo electrónico del contacto',
  })
  email: string;
}
