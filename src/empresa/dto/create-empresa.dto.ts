import { IsString, IsNotEmpty, Length } from 'class-validator';
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
    example: '665f0ec9fe1846d5a9f3baf2',
    description: 'ID de la direccion',
  })
  direccion: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '665f0f02fe1846d5a9f3baf3',
    description: 'ID del contacto',
  })
  contacto: string;
}
