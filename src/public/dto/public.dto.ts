import { ApiProperty } from '@nestjs/swagger';
import { ContactoDto } from 'src/common/dto/contacto.dto';
import { TipoVehiculoDto } from 'src/tipo_vehiculo/dto/tipo-vehiculo.dto';

export class EmpresaPublicDto {
  @ApiProperty({
    description: 'ID de la empresa',
    example: 1,
  })
  _id: string;

  @ApiProperty({
    description: 'CUIT de la empresa (único)',
    example: 30712345678,
  })
  cuit: string;

  @ApiProperty({
    description: 'Nombre comercial de la empresa',
    example: 'Transporte Rápido',
  })
  nombre_comercial: string;

  @ApiProperty({ type: ContactoDto })
  contacto: ContactoDto;
}

export class PublicDto {
  @ApiProperty({ type: [EmpresaPublicDto] })
  empresas: EmpresaPublicDto[];

  @ApiProperty({ type: [TipoVehiculoDto] })
  tipos_vehiculo: TipoVehiculoDto[];
}
