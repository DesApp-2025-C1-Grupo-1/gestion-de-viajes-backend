import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsNumber,
  IsPositive,
  IsMongoId,
  Min,
  Max,
  IsNotEmpty,
} from 'class-validator';
import { isValidLicencePlate } from 'src/common/validators/isValidLicencePlate.validator';

export class CreateVehiculoDto {
  @ApiProperty({
    example: 'ABC123',
    description: 'Patente del vehículo (formato válido: ABC123 o AB123CD)',
  })
  @IsString()
  @isValidLicencePlate({ message: 'La patente no es válida' })
  @IsNotEmpty()
  readonly patente: string;

  @ApiProperty({
    example: 'Toyota',
    description: 'Marca del vehículo',
  })
  @IsString()
  @IsNotEmpty()
  readonly marca: string;

  @ApiProperty({
    example: 'Hilux',
    description: 'Modelo del vehículo',
  })
  @IsString()
  @IsNotEmpty()
  readonly modelo: string;

  @ApiProperty({
    example: 2020,
    description: 'Año de fabricación (entre 1900 y el año actual)',
    minimum: 1900,
    maximum: new Date().getFullYear(),
  })
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  @IsNotEmpty()
  readonly año: number;

  @ApiProperty({
    example: 15.5,
    description: 'Volumen máximo de carga en m³',
    minimum: 0.01,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  readonly volumen_carga: number;

  @ApiProperty({
    example: 1200,
    description: 'Peso máximo de carga en kilogramos',
    minimum: 0.01,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  readonly peso_carga: number;

  @ApiProperty({
    example: '665f0ec9fe1846d5a9f3baf2',
    description: 'ID del tipo de vehículo (referencia a tipoVehiculo)',
  })
  @IsMongoId()
  @IsNotEmpty()
  readonly tipo: string;

  @ApiProperty({
    example: '665f0f02fe1846d5a9f3baf3',
    description: 'ID de la empresa a la que pertenece el vehículo',
  })
  @IsMongoId()
  @IsNotEmpty()
  readonly empresa: string;
}
