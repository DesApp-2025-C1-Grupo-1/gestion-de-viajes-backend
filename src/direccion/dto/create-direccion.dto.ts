import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDireccionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Calle falsa',
    description: 'Nombre de la calle',
  })
  calle: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '234',
    description: 'Numero de la calle',
  })
  numero: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'springfield',
    description: 'ciudad de ubicacion',
  })
  ciudad: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Buenos Aires',
    description: 'estado o provicia de ubicacion',
  })
  estado_provincia: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Argentina',
    description: 'pais de ubicacion',
  })
  pais: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '',
    description: '',
  })
  tipo: string;
}
