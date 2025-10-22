import { forwardRef, Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { ViajeDistribucionModule } from 'src/viaje_distribucion/viaje-distribucion.module';

@Module({
  imports: [forwardRef(() => ViajeDistribucionModule)],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
