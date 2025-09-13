import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RemitosController } from './remitos.controller';
import { RemitosService } from './remitos.service';

@Module({
  imports: [HttpModule],
  controllers: [RemitosController],
  providers: [RemitosService],
})
export class RemitosModule {}
