import {
  IsString,
  IsNumber,
  IsNotEmpty,
  Min,
  Max,
  IsIn,
  Matches,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { CreateDireccionDto } from 'src/direccion/dto/create-direccion.dto';
import { CreateContactoDto } from 'src/contacto/dto/create-contacto.dto';

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

  @ValidateNested()
  @Type(() => CreateDireccionDto)
  @ApiProperty({ type: CreateDireccionDto })
  direccion: CreateDireccionDto;

  @ValidateNested()
  @Type(() => CreateContactoDto)
  @ApiProperty({ type: CreateContactoDto })
  contacto: CreateContactoDto;
}
