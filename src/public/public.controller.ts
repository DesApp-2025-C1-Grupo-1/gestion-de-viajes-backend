import { Controller, Get } from '@nestjs/common';
import { PublicService } from './public.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EmpresaPublicDto, PublicDto } from './dto/public.dto';
import { TipoVehiculoDto } from 'src/tipo_vehiculo/dto/tipo-vehiculo.dto';

@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @ApiOperation({ summary: 'Obtener todas las empresas' })
  @ApiResponse({
    status: 200,
    description: 'Empresas obtenidos correctamente',
    type: [EmpresaPublicDto],
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron empresas',
  })
  @Get('empresas/v1')
  findAllEmpresasV1() {
    return this.publicService.findAllEmpresasV1();
  }

  @ApiOperation({ summary: 'Obtener todas las tipos de vehículo' })
  @ApiResponse({
    status: 200,
    description: 'Tipos de vehículo obtenidos correctamente',
    type: [TipoVehiculoDto],
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron tipos de vehículo',
  })
  @Get('tipos_vehiculo/v1')
  findAllTiposVehiculoV1() {
    return this.publicService.findAllTiposVehiculoV1();
  }
}
