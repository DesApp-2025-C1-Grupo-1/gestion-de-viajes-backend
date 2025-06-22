import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Contacto, ContactoSchema } from 'src/contacto/schemas/contacto.schema';
import {
  Direccion,
  DireccionSchema,
} from 'src/direccion/Schemas/direccion.schema';

export type DepositoDocument = Deposito & Document;

@Schema({ collection: 'deposito', versionKey: false })
export class Deposito {
  @Prop({ type: String, required: true })
  nombre: string;

  @Prop({ type: Number, required: true })
  lat: number;

  @Prop({ type: Number, required: true })
  long: number;

  @Prop({ type: String, required: true })
  tipo: string;

  @Prop({ type: String, required: true })
  horario_entrada: string;

  @Prop({ type: String, required: true })
  horario_salida: string;

  @Prop({ type: String, required: true })
  restricciones: string;

  @Prop({ type: DireccionSchema, required: true })
  direccion: Direccion;
  @Prop({ type: ContactoSchema, required: true })
  contacto: Contacto;

  @Prop({ type: Date, default: null })
  deletedAt: Date;
}

export const DepositoSchema = SchemaFactory.createForClass(Deposito);
