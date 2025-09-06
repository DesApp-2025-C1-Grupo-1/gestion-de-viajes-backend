import { Controller, Get } from '@nestjs/common';
import { PublicService } from './public.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PublicDto } from './dto/public.dto';

@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @ApiOperation({ summary: 'Obtener todas las empresas y tipos de vehículo' })
  @ApiResponse({
    status: 200,
    description: 'Empresas y tipos de vehículo obtenidos correctamente',
    type: [PublicDto],
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron empresas o tipos de vehículo',
  })
  @Get('v1')
  findAllV1() {
    return this.publicService.findAllV1();
  }
}
