import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Empresa, EmpresaSchema } from './schemas/empresa.schema';
import { EmpresaController } from './empresa.controller';
import { EmpresaService } from './empresa.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Empresa.name, schema: EmpresaSchema }]),
  ],
  controllers: [EmpresaController],
  providers: [EmpresaService],
  exports: [MongooseModule],
})
export class EmpresaModule {} 