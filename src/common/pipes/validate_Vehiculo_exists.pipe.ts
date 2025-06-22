import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Vehiculo,
  VehiculoDocument,
} from '../../vehiculo/schemas/vehiculo.schema';

//Este pipe se utiliza para validar si el vehiculo existe en la base de datos

@Injectable()
export class ValidateVehiculoExistsPipe implements PipeTransform {
  constructor(
    @InjectModel(Vehiculo.name)
    private vehiculoModel: Model<VehiculoDocument>,
  ) {}
  async transform(value: Record<string, any>) {
    if (value.vehiculo === undefined) {
      return value;
    }

    if (!Types.ObjectId.isValid(String(value.vehiculo))) {
      throw new BadRequestException('Vehiculo debe ser un ObjectId válido');
    }

    const exists = await this.vehiculoModel.exists({
      _id: value.vehiculo,
      deletedAt: null,
    });
    if (!exists) {
      throw new BadRequestException(
        'Vehículo no existente en la base de datos',
      );
    }

    return value;
  }
}
