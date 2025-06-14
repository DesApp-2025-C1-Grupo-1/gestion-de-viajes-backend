import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Telefono, TelefonoSchema } from 'src/telefono/schemas/telefono.schema';

export type ContactoDocument = Contacto & Document;

@Schema({ versionKey: false })
export class Contacto {
  @Prop({ type: String, required: true })
  nombre: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: TelefonoSchema, required: true })
  telefono: Telefono;
}

export const ContactoSchema = SchemaFactory.createForClass(Contacto);
