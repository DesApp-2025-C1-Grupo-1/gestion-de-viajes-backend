import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

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
}
