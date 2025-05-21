import { registerDecorator, ValidationOptions } from 'class-validator';
import * as dayjs from 'dayjs';

export function IsAdult(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isAdult',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const today = dayjs();
          const birthDate = dayjs(value);
          return (
            birthDate.isValid() &&
            today.diff(birthDate, 'year') >= 18 &&
            today.diff(birthDate, 'year') <= 100
          );
        },
        defaultMessage() {
          return 'El chofer debe de tener al menos 18 años.';
        },
      },
    });
  };
}
