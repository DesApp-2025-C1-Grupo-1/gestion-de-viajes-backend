import { Controller, Get } from '@nestjs/common';
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
  getDashboard() {
    return this.dashboardService.getDashboard();
  }
}
