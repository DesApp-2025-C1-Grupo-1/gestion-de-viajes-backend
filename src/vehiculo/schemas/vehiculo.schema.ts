import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VehiculoDocument = Vehiculo & Document;

@Schema({ collection: 'vehiculo', versionKey: false })
export class Vehiculo {
  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
  })
  patente: string;

  @Prop({ type: String, required: true, trim: true })
  marca: string;

  @Prop({ type: String, required: true, trim: true })
  modelo: string;

  @Prop({
    type: Number,
    required: true,
    trim: true,
    min: 1900,
    max: new Date().getFullYear(),
  })
  año: number;

  @Prop({ type: Number, required: true, min: 0, trim: true })
  volumen_carga: number;

  @Prop({ type: Number, required: true, min: 0, trim: true })
  peso_carga: number;

  @Prop({
    type: Types.ObjectId,
    ref: 'TipoVehiculo',
    required: true,
    trim: true,
  })
  tipo: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Empresa', required: true })
  empresa: Types.ObjectId;
}

export const VehiculoSchema = SchemaFactory.createForClass(Vehiculo);
