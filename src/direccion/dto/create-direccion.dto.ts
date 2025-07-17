import { IsString, IsNotEmpty, IsIn, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateDireccionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty({
    example: 'Calle falsa',
    description: 'Nombre de la calle',
  })
  calle: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  @ApiProperty({
    example: '234',
    description: 'Numero de la calle',
  })
  numero: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty({
    example: 'Springfield',
    description: 'ciudad de ubicacion',
  })
  ciudad: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty({
    example: 'Buenos Aires',
    description: 'estado o provicia de ubicacion',
  })
  estado_provincia: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty({
    example: 'Argentina',
    description: 'pais de ubicacion',
  })
  pais: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  @IsIn(['fiscal', 'deposito'])
  @ApiProperty({
    example: 'fiscal o deposito',
    description: 'tipo de la direccion',
    enum: ['fiscal', 'deposito'],
  })
  tipo: string;
}
