import { Test, TestingModule } from '@nestjs/testing';
import { ChoferController } from './chofer.controller';
import { ChoferService } from './chofer.service';

describe('ChoferController', () => {
  let controller: ChoferController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChoferController],
      providers: [ChoferService],
    }).compile();

    controller = module.get<ChoferController>(ChoferController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
