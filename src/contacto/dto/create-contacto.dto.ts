import { IsString, IsNotEmpty, IsEmail, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateTelefonoDto } from 'src/telefono/dto/create-telefono.dto';

export class CreateContactoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre del contacto',
  })
  nombre: string;

  @IsEmail({}, { message: 'El email no es válido' })
  @IsNotEmpty()
  @ApiProperty({
    example: 'juan@email.com',
    description: 'Correo electrónico del contacto',
  })
  email: string;

  @ValidateNested()
  @Type(() => CreateTelefonoDto)
  @IsNotEmpty()
  @ApiProperty({
    type: CreateTelefonoDto,
    description: 'Teléfono del contacto',
  })
  telefono: CreateTelefonoDto;
}
