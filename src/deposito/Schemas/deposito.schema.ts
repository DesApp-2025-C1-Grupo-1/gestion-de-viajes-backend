import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, ObjectId } from 'mongoose';

export type DepositoDocument = Deposito & Document;

@Schema()
export class Deposito {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  lat: number;

  @Prop({ required: true })
  long: number;

  @Prop({ required: true })
  tipo: string;

  @Prop({ required: true })
  horario_entrada: string;

  @Prop({ required: true })
  horario_salida: string;

  @Prop({ required: true })
  restricciones: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Contacto',
    required: true,
  })
  contacto: ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Direccion',
    required: true,
  })
  direccion: ObjectId;
}

export const DepositoSchema = SchemaFactory.createForClass(Deposito);
