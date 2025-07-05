import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsIn } from 'class-validator';

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
    description:
      'Licencia  requerida para este tipo de vehículo según la clasificación nacional',
    example: 'C1',
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
  @IsNotEmpty()
  @IsString()
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
      message: 'La Licencia requerida no es válida',
    },
  )
  licencias_permitidas: string;
}
