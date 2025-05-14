import { Module } from '@nestjs/common';
import { ChoferService } from './chofer.service';
import { ChoferController } from './chofer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Chofer, ChoferSchema } from './schemas/chofer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chofer.name, schema: ChoferSchema }]),
  ],
  controllers: [ChoferController],
  providers: [ChoferService],
})
export class ChoferModule {}
