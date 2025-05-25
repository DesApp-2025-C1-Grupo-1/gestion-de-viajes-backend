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

  @Prop({ type: DireccionSchema, required: true })
  direccion: Direccion;

  @Prop({ type: ContactoSchema, required: true })
  contacto: Contacto;
}

export const DepositoSchema = SchemaFactory.createForClass(Deposito);
