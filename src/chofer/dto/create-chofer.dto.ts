import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsMongoId,
  Min,
  Max,
  IsIn,
  IsEmail,
  IsPhoneNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsAdult } from '../../common/validators/isAdult.validator';

export class CreateChoferDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Nombre del chofer', example: 'Juan' })
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Apellido del chofer', example: 'Perez' })
  apellido: string;

  @IsNumber()
  @Min(10000000, {
    message: 'El DNI debe tener exactamente 8 dígitos numéricos',
  })
  @Max(99999999, {
    message: 'El DNI debe tener exactamente 8 dígitos numéricos',
  })
  @IsNotEmpty()
  @ApiProperty({ description: 'DNI del chofer', example: 12345678 })
  dni: number;

  @IsString()
  @IsDateString()
  @IsNotEmpty()
  @IsAdult()
  @ApiProperty({ description: 'Fecha de nacimiento', example: '1980-05-12' })
  fecha_nacimiento: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Número de licencia del conductor',
    example: 'ABC123456',
  })
  licencia: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(
    [
      'A1.1',
      'A1.2',
      'A1.3',
      'A1.4',
      'A2.1',
      'A2.2',
      'A3',
      'B1',
      'B2',
      'C1',
      'C2',
      'C3',
      'D1',
      'D2',
      'D3',
      'D4',
      'E1',
      'E2',
      'F',
      'G1',
      'G2',
      'G3',
    ],
    { message: 'El tipo de licencia no es válido' },
  )
  @ApiProperty({
    description: 'Tipo de licencia según clasificación nacional',
    example: 'C1',
  })
  tipo_licencia: string;

  @IsString()
  @IsPhoneNumber(undefined, {
    message: 'El número de teléfono no es válido',
  })
  @IsNotEmpty()
  @ApiProperty({
    description: 'Número de teléfono del chofer',
    example: '+5491123456789',
  })
  telefono: string;

  @IsString()
  @IsEmail({}, { message: 'El email no es válido' })
  @IsNotEmpty()
  @ApiProperty({
    description: 'Correo electrónico del chofer',
    example: 'juan.perez@mail.com',
  })
  email: string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({ description: 'ID de la empresa transportista' })
  empresa: string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({ description: 'ID del vehículo asignado al chofer' })
  vehiculo: string;
}
