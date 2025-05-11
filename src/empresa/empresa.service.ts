import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Empresa, EmpresaDocument } from './schemas/empresa.schema';

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

  async create(empresa: Empresa): Promise<Empresa> {
    const created = new this.empresaModel(empresa);
    return created.save();
  }

  async update(id: string, empresa: Empresa): Promise<Empresa | null> {
    return this.empresaModel
      .findByIdAndUpdate(id, empresa, { new: true })
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const res = await this.empresaModel.findByIdAndDelete(id).exec();
    return !!res;
  }
}
