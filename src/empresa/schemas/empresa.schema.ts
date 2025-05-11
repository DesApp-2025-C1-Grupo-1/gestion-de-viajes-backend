import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmpresaDocument = Empresa & Document;

@Schema({ collection: 'empresa' })
export class Empresa {
  @Prop({ required: true })
  razon_social: string;

  @Prop({ required: true })
  nombre_comercial: string;

  @Prop({ required: true, unique: true })
  cuit: number;

  @Prop({ required: true })
  domicilio_fiscal: string;

  @Prop({ required: true })
  telefono: number;

  @Prop({ required: true })
  mail: string;

  @Prop({ required: true })
  nombre_contacto: string;
}

export const EmpresaSchema = SchemaFactory.createForClass(Empresa);
