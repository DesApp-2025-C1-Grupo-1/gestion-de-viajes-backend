import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
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

  @Prop({ required: true })
  telefono: string;

  @Prop({ required: true })
  mail: string;

  @Prop({ required: true })
  nombre_contacto: string;

  @Prop({ type: DireccionSchema, required: true })
  direccion: Direccion;
}

export const EmpresaSchema = SchemaFactory.createForClass(Empresa);
