import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class EmptyObjectPipe implements PipeTransform {
  transform(value: Record<string, any>): Record<string, any> {
    if (Object.keys(value).length === 0) {
      throw new BadRequestException(
        'El objeto de actualización no puede estar vacío',
      );
    }
    return value;
  }
}
