import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TipoVehiculoModule } from './tipo_vehiculo/tipo_vehiculo.module';
import { VehiculoModule } from './vehiculo/vehiculo.module';
import { EmpresaModule } from './empresa/empresa.module';
import { DatabaseModule } from './database/database.module';
import { ChoferModule } from './chofer/chofer.module';
import { DepositoModule } from './deposito/deposito.module';
import { ViajeModule } from './viaje/viaje.module';
import { ViajeDistribucionModule } from './viaje_distribucion/viaje-distribucion.module';

@Module({
  imports: [
    TipoVehiculoModule,
    DatabaseModule,
    VehiculoModule,
    EmpresaModule,
    ChoferModule,
    DepositoModule,
    ViajeModule,
    ViajeDistribucionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
