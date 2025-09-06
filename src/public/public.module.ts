import { forwardRef, Module } from '@nestjs/common';
import { PublicService } from './public.service';
import { PublicController } from './public.controller';
import { TipoVehiculoModule } from 'src/tipo_vehiculo/tipo_vehiculo.module';
import { EmpresaModule } from 'src/empresa/empresa.module';

@Module({
  imports: [
    forwardRef(() => TipoVehiculoModule),
    forwardRef(() => EmpresaModule),
  ],
  controllers: [PublicController],
  providers: [PublicService],
})
export class PublicModule {}
