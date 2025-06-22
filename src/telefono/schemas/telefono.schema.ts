import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TelefonoDocument = Telefono & Document;

@Schema({ versionKey: false })
export class Telefono {
  @Prop({ type: String, required: true })
  codigo_pais: string;

  @Prop({ type: String, required: false })
  codigo_area: string;

  @Prop({ type: String, required: true })
  numero: string;
}

export const TelefonoSchema = SchemaFactory.createForClass(Telefono);
