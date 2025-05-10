import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VehiculoDocument = Vehiculo & Document;

@Schema({ collection: 'vehiculo' })
export class Vehiculo {
  @Prop({ required: true })
  patente: string;

  @Prop({ required: true })
  marca: string;

  @Prop({ required: true })
  modelo: string;

  @Prop({ required: true, min: 1900, max: new Date().getFullYear() })
  año: number;

  @Prop({ required: true, min: 0 })
  volumen_carga: number;

  @Prop({ required: true, min: 0 })
  peso_carga: number;

  @Prop({ type: Types.ObjectId, ref: 'TipoVehiculo', required: true })
  tipo: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Empresa', required: true })
  empresa: Types.ObjectId;
}

export const VehiculoSchema = SchemaFactory.createForClass(Vehiculo);
