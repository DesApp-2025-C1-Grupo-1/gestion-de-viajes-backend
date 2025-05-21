import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Empresa, EmpresaDocument } from './schemas/empresa.schema';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';

@Injectable()
export class EmpresaService {
  constructor(
    @InjectModel(Empresa.name) private empresaModel: Model<EmpresaDocument>,
  ) {}

  async findAll(): Promise<Empresa[]> {
    return this.empresaModel.find().exec();
  }

  async findOne(id: string): Promise<Empresa | null> {
    return this.empresaModel.findById(id).exec();
  }

  async create(createEmpresaDto: CreateEmpresaDto): Promise<Empresa> {
    const { cuit } = createEmpresaDto;

    const empresaExistente = await this.empresaModel.findOne({ cuit });
    if (empresaExistente) {
      throw new BadRequestException('Ya existe una empresa con ese CUIT');
    }

    const created = new this.empresaModel(createEmpresaDto);
    return created.save();
  }

  async update(
    id: string,
    updateEmpresaDto: UpdateEmpresaDto,
  ): Promise<Empresa | null> {
    return this.empresaModel
      .findByIdAndUpdate(id, updateEmpresaDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const res = await this.empresaModel.findByIdAndDelete(id).exec();
    return !!res;
  }
}
