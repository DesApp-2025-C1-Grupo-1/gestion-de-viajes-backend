import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsPhoneNumber,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmpresaDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Razón social de la empresa',
    example: 'Transporte S.A.',
  })
  razon_social: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Nombre comercial de la empresa',
    example: 'Transporte Rápido',
  })
  nombre_comercial: string;

  @IsString()
  @Length(11, 11, {
    message: 'El CUIT debe tener 11 dígitos',
  })
  @IsNotEmpty()
  @ApiProperty({
    description: 'CUIT de la empresa (único)',
    example: 30712345678,
  })
  cuit: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Domicilio fiscal',
    example: 'Av. Siempre Viva 123',
  })
  domicilio_fiscal: string;

  @IsPhoneNumber(undefined, { message: 'El teléfono no es válido' })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Teléfono de contacto',
    example: '+541234567890',
  })
  telefono: string;

  @IsEmail({}, { message: 'El email no es válido' })
  @IsNotEmpty()
  @ApiProperty({
    description: 'Correo electrónico',
    example: 'info@empresa.com',
  })
  mail: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Nombre del contacto de la empresa',
    example: 'Juan Pérez',
  })
  nombre_contacto: string;
}
