import { IsString, IsNumber, IsNotEmpty, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDepositoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Depósito Central',
    description: 'Nombre del depósito',
  })
  nombre: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: -34.6037, description: 'Latitud del depósito' })
  lat: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: -58.3816, description: 'Longitud del depósito' })
  long: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Propio',
    description: 'Tipo de depósito si propio o de tercero',
  })
  tipo: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '08:00',
    description: 'Horario de apertura del depósito',
  })
  horario_entrada: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '18:00',
    description: 'Horario de cierre del depósito',
  })
  horario_salida: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'No se permite carga inflamable',
    description: 'Restricciones del depósito',
  })
  restricciones: string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({
    example: '665f0f02fe1846d5a9f3baf3',
    description: 'ID del contacto',
  })
  contacto: string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({
    example: '665f0f02fe1846d5a9f3baf3',
    description: 'ID de dirreccion',
  })
  direccion: string;
}
