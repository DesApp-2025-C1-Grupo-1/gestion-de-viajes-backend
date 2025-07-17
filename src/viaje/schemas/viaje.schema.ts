import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ViajeDocument = Viaje & Document;

@Schema({ collection: 'viaje', versionKey: false })
export class Viaje {
  @Prop({ type: Date, required: true })
  fecha_inicio: Date;

  @Prop({ type: Date })
  fecha_llegada: Date;

  @Prop({ type: String, required: true })
  tipo_viaje: string;

  @Prop({ type: Types.ObjectId, ref: 'Deposito', required: true })
  deposito_origen: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Deposito', required: true })
  deposito_destino: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Empresa', required: true })
  empresa: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Chofer', required: true })
  chofer: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Vehiculo', required: true })
  vehiculo: Types.ObjectId;

  @Prop({ type: Date, default: null })
  deletedAt: Date;
}

export const ViajeSchema = SchemaFactory.createForClass(Viaje);
