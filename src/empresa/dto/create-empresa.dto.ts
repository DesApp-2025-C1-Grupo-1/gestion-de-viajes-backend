import { IsString, IsNotEmpty, Length, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateDireccionDto } from 'src/direccion/dto/create-direccion.dto';
import { CreateContactoDto } from 'src/contacto/dto/create-contacto.dto';

export class CreateEmpresaDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Razón social de la empresa',
    example: 'Transporte S.A.',
  })
  razon_social: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Nombre comercial de la empresa',
    example: 'Transporte Rápido',
  })
  nombre_comercial: string;

  @IsString()
  @Length(11, 11, {
    message: 'El CUIT debe tener 11 dígitos',
  })
  @IsNotEmpty()
  @ApiProperty({
    description: 'CUIT de la empresa (único)',
    example: 30712345678,
  })
  cuit: string;

  @ValidateNested()
  @Type(() => CreateDireccionDto)
  @ApiProperty({ type: CreateDireccionDto })
  direccion: CreateDireccionDto;

  @ValidateNested()
  @Type(() => CreateContactoDto)
  @ApiProperty({ type: CreateContactoDto })
  contacto: CreateContactoDto;
}
