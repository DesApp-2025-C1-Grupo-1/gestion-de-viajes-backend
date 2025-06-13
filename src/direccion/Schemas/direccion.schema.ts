import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DireccionDocument = Direccion & Document;

@Schema({ versionKey: false })
export class Direccion {
  @Prop({ type: String, required: true })
  calle: string;

  @Prop({ type: String, required: true })
  numero: string;

  @Prop({ type: String, required: true })
  ciudad: string;

  @Prop({ type: String, required: true })
  estado_provincia: string;

  @Prop({ type: String, required: true })
  pais: string;

  @Prop({ type: String, required: true })
  tipo: string;
}
export const DireccionSchema = SchemaFactory.createForClass(Direccion);
