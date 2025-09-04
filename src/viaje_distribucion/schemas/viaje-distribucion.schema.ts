import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ViajeDistribucionDocument = ViajeDistribucion & Document;

@Schema({ collection: 'viaje_distribucion', versionKey: false })
export class ViajeDistribucion {
  @Prop({ type: Date, required: true })
  fecha_inicio: Date;

  @Prop({ type: Date })
  fecha_llegada: Date;

  @Prop({
    type: String,
    enum: ['iniciado', 'cargando', 'cargado', 'finalizado'],
    default: 'iniciado',
  })
  estado: string;

  // Campo origen - puede ser un depósito u otra ubicación
  @Prop({ type: Types.ObjectId, ref: 'Deposito', required: true })
  origen: Types.ObjectId;

  // Chofer asignado al viaje
  @Prop({ type: Types.ObjectId, ref: 'Chofer', required: true })
  chofer: Types.ObjectId;

  // Empresa transportista
  @Prop({ type: Types.ObjectId, ref: 'Empresa', required: true })
  transportista: Types.ObjectId;

  // Vehículo utilizado
  @Prop({ type: Types.ObjectId, ref: 'Vehiculo', required: true })
  vehiculo: Types.ObjectId;

  // Relación con Remitos
  @Prop({ type: [String], required: true })
  remito_ids: string[];

  // Relación con Tarifa
  @Prop({ type: String, required: true })
  tarifa_id: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: null })
  deletedAt: Date;
}

export const ViajeDistribucionSchema =
  SchemaFactory.createForClass(ViajeDistribucion);
