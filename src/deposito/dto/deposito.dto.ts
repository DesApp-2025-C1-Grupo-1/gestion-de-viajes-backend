import { ApiProperty } from '@nestjs/swagger';
import { DireccionDto } from 'src/common/dto/direccion.dto';

export class DepositoDto {
  @ApiProperty({
    example: '123456789',
    description: 'ID del depósito',
  })
  _id: string;

  @ApiProperty({
    example: 'Depósito Central',
    description: 'Nombre del depósito',
  })
  nombre: string;

  @ApiProperty({ example: -34.6037, description: 'Latitud del depósito' })
  lat: number;

  @ApiProperty({ example: -58.3816, description: 'Longitud del depósito' })
  long: number;

  @ApiProperty({
    example: 'Propio',
    description: 'Tipo de depósito si propio o de tercero',
  })
  tipo: string;

  @ApiProperty({
    example: '08:00',
    description: 'Horario de apertura del depósito',
  })
  horario_entrada: string;

  @ApiProperty({
    example: '18:00',
    description: 'Horario de cierre del depósito',
  })
  horario_salida: string;

  @ApiProperty({
    example: 'No se permite carga inflamable',
    description: 'Restricciones del depósito',
  })
  restricciones: string;

  @ApiProperty({ type: DireccionDto })
  direccion: DireccionDto;

  @ApiProperty({ type: DireccionDto })
  contacto: DireccionDto;
}
