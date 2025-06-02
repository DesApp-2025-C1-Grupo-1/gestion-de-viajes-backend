import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Deposito,
  DepositoDocument,
} from 'src/deposito/Schemas/deposito.schema';

//Este pipe se utiliza para validar si un deposito existe en la base de datos

@Injectable()
export class ValidateDepositoExistsPipe implements PipeTransform {
  constructor(
    @InjectModel(Deposito.name)
    private depositoModel: Model<DepositoDocument>,
  ) {}

  async transform(value: Record<string, any>) {
    if (value.deposito === undefined) {
      return value;
    }

    if (!Types.ObjectId.isValid(String(value.deposito))) {
      throw new BadRequestException('Deposito debe ser un ObjectId válido');
    }

    const exists = await this.depositoModel.exists({ _id: value.deposito });
    if (!exists) {
      throw new BadRequestException(
        'Deposito no existente en la base de datos',
      );
    }

    return value;
  }
}
