import { Test, TestingModule } from '@nestjs/testing';
import { EmpresaService } from './empresa.service';
import { getModelToken } from '@nestjs/mongoose';
import { Empresa } from './schemas/empresa.schema';

const mockEmpresaModel = {
  find: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue([]),
  findById: jest.fn().mockReturnThis(),
  findByIdAndUpdate: jest.fn().mockReturnThis(),
  findByIdAndDelete: jest.fn().mockReturnThis(),
  save: jest.fn(),
};

describe('EmpresaService', () => {
  let service: EmpresaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmpresaService,
        {
          provide: getModelToken(Empresa.name),
          useValue: mockEmpresaModel,
        },
      ],
    }).compile();

    service = module.get<EmpresaService>(EmpresaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return array', async () => {
    expect(await service.findAll()).toEqual([]);
  });
}); 