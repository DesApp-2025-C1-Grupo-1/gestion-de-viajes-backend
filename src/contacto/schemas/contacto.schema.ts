import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Telefono, TelefonoSchema } from 'src/telefono/schemas/telefono.schema';

export type ContactoDocument = Contacto & Document;

@Schema()
export class Contacto {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  email: string;

  @Prop({ type: TelefonoSchema, required: true })
  telefono: Telefono;
}

export const ContactoSchema = SchemaFactory.createForClass(Contacto);
