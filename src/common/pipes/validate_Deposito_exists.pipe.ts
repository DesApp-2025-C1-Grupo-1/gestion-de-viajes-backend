import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Deposito,
  DepositoDocument,
} from 'src/deposito/Schemas/deposito.schema';

//Este pipe se utiliza para validar si los depositos de un viaje existen en la base de datos, y que no sean iguales

@Injectable()
export class ValidateDepositoExistsPipe implements PipeTransform {
  constructor(
    @InjectModel(Deposito.name)
    private depositoModel: Model<DepositoDocument>,
  ) {}

  async transform(value: Record<string, any>) {
    const camposAValidar = ['deposito_origen', 'deposito_destino'];

    // Extraemos los ids para la comparación
    const idOrigen =
      typeof value['deposito_origen'] === 'string'
        ? value['deposito_origen']
        : undefined;
    const idDestino =
      typeof value['deposito_destino'] === 'string'
        ? value['deposito_destino']
        : undefined;

    // Validación que no sean iguales
    if (idOrigen && idDestino && idOrigen === idDestino) {
      throw new BadRequestException(
        'El depósito de origen y destino no pueden ser el mismo',
      );
    }

    // Validamos existencia y formato para cada campo
    for (const campo of camposAValidar) {
      const id: string | undefined =
        typeof value[campo] === 'string' ? value[campo] : undefined;
      if (id === undefined) continue;

      if (!Types.ObjectId.isValid(String(id))) {
        throw new BadRequestException(`${campo} debe ser un ObjectId válido`);
      }

      const exists = await this.depositoModel.exists({ _id: id });
      if (!exists) {
        throw new BadRequestException(
          `${campo} no existente en la base de datos`,
        );
      }
    }

    return value;
  }
}
