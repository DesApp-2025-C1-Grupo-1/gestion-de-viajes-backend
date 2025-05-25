import { IsString, IsNotEmpty, Matches, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTelefonoDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+$/, {
    message: 'El código de país debe contener solo números',
  })
  @ApiProperty({
    example: '54',
    description: 'Código de país',
  })
  codigo_pais: string;

  @ValidateIf((o: CreateTelefonoDto) => o.codigo_pais === '54')
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+$/, {
    message: 'El código de área debe contener solo números',
  })
  @ApiProperty({
    example: '11',
    description: 'Código de área',
  })
  codigo_area: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+$/, {
    message: 'El número debe contener solo números',
  })
  @ApiProperty({
    example: '12345678',
    description: 'Número de teléfono sin código de país ni área',
  })
  numero: string;
}
