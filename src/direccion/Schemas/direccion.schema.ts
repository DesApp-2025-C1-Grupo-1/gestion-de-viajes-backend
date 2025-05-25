import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DireccionDocument = Direccion & Document;

@Schema({ versionKey: false })
export class Direccion {
  @Prop({ required: true })
  calle: string;

  @Prop({ required: true })
  numero: string;

  @Prop({ required: true })
  ciudad: string;

  @Prop({ required: true })
  estado_provincia: string;

  @Prop({ required: true })
  pais: string;

  @Prop({ required: true })
  tipo: string;
}
export const DireccionSchema = SchemaFactory.createForClass(Direccion);
