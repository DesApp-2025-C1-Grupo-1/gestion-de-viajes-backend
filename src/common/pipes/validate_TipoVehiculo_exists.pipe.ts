import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  TipoVehiculo,
  TipoVehiculoDocument,
} from '../../tipo_vehiculo/schemas/tipo_vehiculo.schema';

//Este pipe se utiliza para validar si el tipo de vehículo existe en la base de datos

@Injectable()
export class ValidateTipoVehiculoExistsPipe implements PipeTransform {
  constructor(
    @InjectModel(TipoVehiculo.name)
    private tipoVehiculoModel: Model<TipoVehiculoDocument>,
  ) {}

  async transform(value: Record<string, any>) {
    if (value.tipo === undefined) {
      return value;
    }

    if (!Types.ObjectId.isValid(String(value.tipo))) {
      throw new BadRequestException('tipo debe ser un ObjectId válido');
    }

    const exists = await this.tipoVehiculoModel.exists({
      _id: value.tipo,
      deletedAt: null,
    });
    if (!exists) {
      throw new BadRequestException(
        'Tipo de vehículo no existente en la base de datos',
      );
    }

    return value;
  }
}
