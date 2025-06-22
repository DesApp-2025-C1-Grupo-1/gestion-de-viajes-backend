import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Chofer, ChoferDocument } from 'src/chofer/schemas/chofer.schema';

//Este pipe se utiliza para validar si un chofer existe en la base de datos

@Injectable()
export class ValidateChoferExistsPipe implements PipeTransform {
  constructor(
    @InjectModel(Chofer.name)
    private choferModel: Model<ChoferDocument>,
  ) {}

  async transform(value: Record<string, any>) {
    if (value.chofer === undefined) {
      return value;
    }

    if (!Types.ObjectId.isValid(String(value.chofer))) {
      throw new BadRequestException('Chofer debe ser un ObjectId válido');
    }

    const exists = await this.choferModel.exists({
      _id: value.chofer,
      deletedAt: null,
    });
    if (!exists) {
      throw new BadRequestException('Chofer no existente en la base de datos');
    }

    return value;
  }
}
