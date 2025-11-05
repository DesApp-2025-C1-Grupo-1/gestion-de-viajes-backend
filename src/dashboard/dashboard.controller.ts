import { Controller, Get, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { DashboardDistribucionResponseDto } from './dto/dashboardDistribucion.dto';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOperation({ summary: 'Obtener datos del dashboard' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard obtenido correctamente',
    type: DashboardDistribucionResponseDto,
  })
  @Get()
  async getDashboard(): Promise<DashboardDistribucionResponseDto> {
    try {
      return await this.dashboardService.getDashboard();
    } catch (err) {
      throw new BadRequestException(
        typeof err === 'string'
          ? err
          : err instanceof Error && typeof err.message === 'string'
            ? err.message
            : 'Error desconocido al obtener dashboard',
      );
    }
  }
}
