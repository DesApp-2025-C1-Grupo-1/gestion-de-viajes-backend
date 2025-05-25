import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Contacto, ContactoSchema } from 'src/contacto/schemas/contacto.schema';
import {
  Direccion,
  DireccionSchema,
} from 'src/direccion/Schemas/direccion.schema';

export type EmpresaDocument = Empresa & Document;

@Schema({ collection: 'empresa' })
export class Empresa {
  @Prop({ required: true })
  razon_social: string;

  @Prop({ required: true })
  nombre_comercial: string;

  @Prop({ required: true, unique: true })
  cuit: string;

  @Prop({ type: DireccionSchema, required: true })
  direccion: Direccion;

  @Prop({ type: ContactoSchema, required: true })
  contacto: Contacto;
}

export const EmpresaSchema = SchemaFactory.createForClass(Empresa);
