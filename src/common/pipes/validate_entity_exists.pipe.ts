import {
  BadRequestException,
  Injectable,
  PipeTransform,
  Type,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Document } from 'mongoose';

export function ValidateEntityExistsPipe<T>(
  entity: Type<T>,
  propertyName: string,
  entityNameForMessage: string,
): Type<PipeTransform> {
  @Injectable()
  class MixinValidateEntityExistsPipe implements PipeTransform {
    constructor(@InjectModel(entity.name) private model: Model<T & Document>) {}

    async transform(value: Record<string, any>) {
      if (value[propertyName] === undefined) {
        return value;
      }

      if (!Types.ObjectId.isValid(String(value[propertyName]))) {
        throw new BadRequestException(
          `${entityNameForMessage} debe ser un ObjectId válido`,
        );
      }

      const exists = await this.model.exists({
        _id: value[propertyName],
        deletedAt: null,
      });

      if (!exists) {
        throw new BadRequestException(
          `${entityNameForMessage} no existente en la base de datos`,
        );
      }

      return value;
    }
  }

  return MixinValidateEntityExistsPipe;
}
