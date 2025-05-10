import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  TipoVehiculo,
  TipoVehiculoDocument,
} from '../../tipo_vehiculo/schemas/tipo_vehiculo.schema';

//Este pipe se utiliza para validar si el tipo de vehículo y la empresa existen en la base de datos,
// pero es necesario que empresa esté implementada para pode validar que existe

@Injectable()
export class ValidateTipoVehiculoExistsPipe implements PipeTransform {
  constructor(
    @InjectModel(TipoVehiculo.name)
    private tipoModel: Model<TipoVehiculoDocument>,
    // @InjectModel(Empresa.name) private empresaModel: Model<EmpresaDocument>,
  ) {}

  async transform(value: { tipo: any; empresa: any }) {
    const tipoExists = await this.tipoModel.exists({
      _id: value.tipo,
    });

    if (!tipoExists) {
      throw new BadRequestException(
        'Tipo de vehículo no existente en la base de datos',
      );
    }

    // Decomentar cuando el modelo empresa esté implementado
    // const empresaExists = await this.empresaModel.exists({
    //   _id: value.empresa,
    // });

    // if (!empresaExists) {
    //   throw new BadRequestException('Empresa no existente en la base de datos');
    // }

    return value;
  }
}
