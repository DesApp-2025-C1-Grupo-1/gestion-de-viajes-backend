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
  cuit: string;

  @Prop({ required: true })
  domicilio_fiscal: string;

  //calle
  //numero
  //ciudad
  //provincia
  //pais
  //codigo_postal
  //faltan agregar estos atributos dentro del subdocumento dirección, y también en la entidad Depositos, hay que avisarle a Ariel

  @Prop({ required: true })
  telefono: string;

  @Prop({ required: true })
  mail: string;

  @Prop({ required: true })
  nombre_contacto: string;
}

export const EmpresaSchema = SchemaFactory.createForClass(Empresa);
