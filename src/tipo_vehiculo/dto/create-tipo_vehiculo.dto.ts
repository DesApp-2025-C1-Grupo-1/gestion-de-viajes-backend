import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsArray,
  IsIn,
  ArrayNotEmpty,
  ArrayUnique,
} from 'class-validator';

export class CreateTipoVehiculoDto {
  @ApiProperty({
    example: 'Forgón',
    description: 'Nombre del tipo de vehículo',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  nombre: string;

  @ApiProperty({
    example:
      'Vehículo de carga cerrado, con capacidad de carga de hasta 3 toneladas.',
    description: 'Descripción del tipo de vehículo',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  descripcion: string;

  @ApiProperty({
    description: 'licencias permitidas según la clasificación nacional',
    example: ['C1', 'E'],
    enum: [
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
    isArray: true,
  })
  @IsArray()
  @ArrayNotEmpty({ message: 'Debe haber al menos una licencia permitida' })
  @ArrayUnique({ message: 'Las licencias permitidas no deben repetirse' })
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
    {
      each: true,
      message: 'Licencia no es válida',
    },
  )
  licencias_permitidas: string[];
}
