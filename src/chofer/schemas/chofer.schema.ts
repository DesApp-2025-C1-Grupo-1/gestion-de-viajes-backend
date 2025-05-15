import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ChoferDocument = Chofer & Document;

@Schema({ collection: 'chofer' })
export class Chofer {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  apellido: string;

  @Prop({ required: true })
  dni: number;

  @Prop({ type: Date, required: true })
  fecha_nacimiento: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Empresa', required: true })
  empresa: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Vehiculo',
    required: true,
  })
  vehiculo: string;
}

export const ChoferSchema = SchemaFactory.createForClass(Chofer);
