import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

//Este pipe se utiliza para transformar campos de tipo string a ObjectId para subirlos a la base de datos

@Injectable()
export class TransformObjectIdFieldsPipe implements PipeTransform {
  constructor(private readonly fields: string[]) {}

  transform(value: Record<string, any>) {
    for (const field of this.fields) {
      const val: unknown = value[field];
      if (val !== undefined) {
        if (typeof val !== 'string' || !Types.ObjectId.isValid(val)) {
          throw new BadRequestException(`${field} is not a valid ObjectId`);
        }
        value[field] = new Types.ObjectId(val);
      }
    }
    return value;
  }
}
