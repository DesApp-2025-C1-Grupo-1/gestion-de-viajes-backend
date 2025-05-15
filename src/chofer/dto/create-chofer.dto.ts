import {
  IsNumber,
  IsString,
  IsDateString,
  IsMongoId,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChoferDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'nombre  del chofer', example: 'Juan' })
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'apellido del chofer', example: 'Perez' })
  apellido: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'DNI/identidad del chofer', example: '12345678' })
  dni: number;

  @IsDateString()
  @ApiProperty({ description: 'fecha de nacimiento', example: '1980-05-12' })
  fecha_nacimiento: string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({ description: 'empresa transportista perteneciente.' })
  empresa: string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({ description: 'vehiculo asignado' })
  vehiculo: string;
}
