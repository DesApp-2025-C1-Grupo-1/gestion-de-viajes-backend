import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TipoVehiculoDocument = TipoVehiculo & Document;

@Schema({ collection: 'tipo_vehiculo', versionKey: false })
export class TipoVehiculo {
  @Prop({ type: String, required: true, trim: true })
  nombre: string;
  @Prop({ type: String, required: true, trim: true })
  descripcion: string;

  @Prop({ type: Date, default: null })
  deletedAt: Date;
  @Prop({ type: String, required: true })
  licencia_permitida: string;
}

export const TipoVehiculoSchema = SchemaFactory.createForClass(TipoVehiculo);

TipoVehiculoSchema.index(
  { nombre: 1 },
  {
    unique: true,
    partialFilterExpression: { deletedAt: null },
  },
);
