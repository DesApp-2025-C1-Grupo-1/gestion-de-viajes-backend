import {
  IsString,
  IsInt,
  IsNumber,
  IsPositive,
  IsMongoId,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVehiculoDto {
  @IsString()
  readonly patente: string;

  @IsString()
  readonly marca: string;

  @IsString()
  readonly modelo: string;

  @Type(() => Number)
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  readonly año: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  readonly volumen_carga: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  readonly peso_carga: number;

  @IsMongoId()
  readonly tipo: string;

  @IsMongoId()
  readonly empresa: string;
}
