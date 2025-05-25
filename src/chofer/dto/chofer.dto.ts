import { ApiProperty } from '@nestjs/swagger';
import { EmpresaDto } from 'src/empresa/dto/empresa.dto';
import { VehiculoDto } from 'src/vehiculo/dto/vehiculo.dto';

export class ChoferDto {
  @ApiProperty({
    description: 'ID del chofer',
    example: '665f0f02fe1846d5a9f3baf3',
  })
  _id?: string;

  @ApiProperty({ description: 'Nombre del chofer', example: 'Juan' })
  nombre: string;

  @ApiProperty({ description: 'Apellido del chofer', example: 'Perez' })
  apellido: string;

  @ApiProperty({ description: 'DNI del chofer', example: 12345678 })
  dni: number;

  @ApiProperty({ description: 'Fecha de nacimiento', example: '1980-05-12' })
  fecha_nacimiento: string;

  @ApiProperty({
    description: 'Número de licencia del conductor',
    example: 'ABC123456',
  })
  licencia: string;

  @ApiProperty({
    description: 'Tipo de licencia según clasificación nacional',
    example: 'C1',
  })
  tipo_licencia: string;

  @ApiProperty({
    description: 'Número de teléfono del chofer',
    example: '+5491123456789',
  })
  telefono: string;

  @ApiProperty({
    description: 'Correo electrónico del chofer',
    example: 'juan.perez@mail.com',
  })
  email: string;

  @ApiProperty({ type: EmpresaDto })
  empresa: EmpresaDto;

  @ApiProperty({ type: VehiculoDto })
  vehiculo: VehiculoDto;
}
