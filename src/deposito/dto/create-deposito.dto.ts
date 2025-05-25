import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsMongoId,
  Min,
  Max,
  IsIn,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateDepositoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Depósito Central',
    description: 'Nombre del depósito',
  })
  nombre: string;

  @Min(-90, { message: 'La latitud mínima es -90' })
  @Max(90, { message: 'La latitud máxima es 90' })
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: -34.6037, description: 'Latitud del depósito' })
  lat: number;

  @Min(-180, { message: 'La longitud mínima es -180' })
  @Max(180, { message: 'La longitud máxima es 180' })
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: -58.3816, description: 'Longitud del depósito' })
  long: number;

  @Transform(({ value }: { value: string }) => value.toLowerCase())
  @IsIn(['propio', 'tercero'], {
    message: 'El tipo debe ser "Propio" o "Tercero"',
  })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Propio',
    description: 'Tipo de depósito si propio o de tercero',
  })
  tipo: string;

  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'El horario debe tener formato HH:mm (ej. 08:00)',
  })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '08:00',
    description: 'Horario de apertura del depósito',
  })
  horario_entrada: string;

  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'El horario debe tener formato HH:mm (ej. 08:00)',
  })
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
