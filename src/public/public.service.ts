import { Injectable } from '@nestjs/common';
import { Empresa, EmpresaDocument } from 'src/empresa/schemas/empresa.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  TipoVehiculo,
  TipoVehiculoDocument,
} from 'src/tipo_vehiculo/schemas/tipo_vehiculo.schema';

@Injectable()
export class PublicService {
  constructor(
    @InjectModel(Empresa.name) private empresaModel: Model<EmpresaDocument>,
    @InjectModel(TipoVehiculo.name)
    private tipoVehiculoModel: Model<TipoVehiculoDocument>,
  ) {}

  async findAllV1() {
    const empresas = await this.empresaModel
      .find(
        {},
        {
          _id: 1,
          cuit: 1,
          nombre_comercial: 1,
          contacto: 1,
        },
      )
      .lean();

    const tiposVehiculo = await this.tipoVehiculoModel.find().lean();

    return [{ empresas, tipos_vehiculo: tiposVehiculo }];
  }
}
