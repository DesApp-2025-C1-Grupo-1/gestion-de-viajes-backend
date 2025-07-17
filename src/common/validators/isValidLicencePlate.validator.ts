import { registerDecorator, ValidationOptions } from 'class-validator';

export function isValidLicencePlate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidLicencePlate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any): boolean {
          const formatoViejo = /^[A-Z]{3}\d{3}$/; // ABC123
          const formatoNuevo = /^[A-Z]{2}\d{3}[A-Z]{2}$/; // AB123CD
          return (
            typeof value === 'string' &&
            (formatoViejo.test(value) || formatoNuevo.test(value))
          );
        },
        defaultMessage(): string {
          return 'La patente debe tener un formato válido (ej: ABC123 o AB123CD)';
        },
      },
    });
  };
}
