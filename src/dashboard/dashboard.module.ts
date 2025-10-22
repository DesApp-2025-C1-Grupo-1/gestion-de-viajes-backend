import { forwardRef, Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { ViajeDistribucionModule } from 'src/viaje_distribucion/viaje-distribucion.module';
import { TarifasModule } from 'src/tarifas/tarifas.module';
import { RemitosModule } from 'src/remitos/remitos.module';

@Module({
  imports: [
    forwardRef(() => ViajeDistribucionModule),
    forwardRef(() => TarifasModule),
    forwardRef(() => RemitosModule),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
