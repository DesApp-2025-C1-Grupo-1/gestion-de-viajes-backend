import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class ZonaDto {
  @ApiProperty({ example: 1, description: 'ID de la zona' })
  @IsInt()
  id: number;

  @ApiProperty({ example: 'Ituzaingó', description: 'Nombre de la zona' })
  @IsNotEmpty()
  nombre: string;
}
