import { Module } from '@nestjs/common';
import { DireccionService } from './direccion.service';
import { DireccionController } from './direccion.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Direccion, DireccionSchema } from './Schemas/direccion.schema';
// import { EmpresaModule } from 'src/empresa/empresa.module';
// import { DepositoModule } from 'src/deposito/deposito.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Direccion.name, schema: DireccionSchema },
    ]),
    // EmpresaModule,
    // DepositoModule,
  ],

  controllers: [DireccionController],
  providers: [DireccionService],
})
export class DireccionModule {}
