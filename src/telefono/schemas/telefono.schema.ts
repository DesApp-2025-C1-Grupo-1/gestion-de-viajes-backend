import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TelefonoDocument = Telefono & Document;

@Schema()
export class Telefono {
  @Prop({ required: true })
  codigo_pais: string;

  @Prop({ required: false })
  codigo_area: string;

  @Prop({ required: true })
  numero: string;
}

export const TelefonoSchema = SchemaFactory.createForClass(Telefono);
