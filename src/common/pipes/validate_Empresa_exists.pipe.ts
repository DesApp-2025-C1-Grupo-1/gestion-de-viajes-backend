import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Empresa, EmpresaDocument } from 'src/empresa/schemas/empresa.schema';

//Este pipe se utiliza para validar si la empresa existe en la base de datos

@Injectable()
export class ValidateEmpresaExistsPipe implements PipeTransform {
  constructor(
    @InjectModel(Empresa.name)
    private empresaModel: Model<EmpresaDocument>,
  ) {}

  async transform(value: Record<string, any>) {
    if (value.empresa === undefined) {
      return value;
    }

    if (!Types.ObjectId.isValid(String(value.empresa))) {
      throw new BadRequestException('empresa debe ser un ObjectId válido');
    }

    const exists = await this.empresaModel.exists({
      _id: value.empresa,
      deletedAt: null,
    });
    if (!exists) {
      throw new BadRequestException('Empresa no existente en la base de datos');
    }

    return value;
  }
}
