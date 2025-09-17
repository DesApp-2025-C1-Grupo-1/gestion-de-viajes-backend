import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ViajeDistribucionDocument = ViajeDistribucion & Document;

@Schema({ collection: 'viaje_distribucion', versionKey: false })
export class ViajeDistribucion {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: Date, required: true })
  fecha_inicio: Date;

  @Prop({
    type: String,
    enum: ['iniciado', 'cargando', 'cargado', 'finalizado'],
    default: 'iniciado',
  })
  estado: string;

  @Prop({ type: String, enum: ['nacional', 'internacional'], required: true })
  tipo_viaje: string;

  @Prop({ type: Types.ObjectId, ref: 'Deposito', required: true })
  origen: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Chofer', required: true })
  chofer: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Empresa', required: true })
  transportista: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Vehiculo', required: true })
  vehiculo: Types.ObjectId;

  @Prop({ type: [Number], required: true })
  remito_ids: number[];

  @Prop({ type: Number, required: true })
  tarifa_id?: number;

  @Prop({ type: Number, required: true, min: 0 })
  kilometros: number;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: null })
  deletedAt: Date;
}

export const ViajeDistribucionSchema =
  SchemaFactory.createForClass(ViajeDistribucion);
