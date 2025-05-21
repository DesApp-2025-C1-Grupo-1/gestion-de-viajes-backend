import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, ObjectId } from 'mongoose';

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

  @Prop({ required: true })
  licencia: string;

  @Prop({ required: true })
  tipo_licencia: string;

  @Prop({ required: true })
  telefono: string;

  @Prop({ required: true })
  email: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Vehiculo',
    required: true,
  })
  vehiculo: ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Empresa', required: true })
  empresa: ObjectId;
}

export const ChoferSchema = SchemaFactory.createForClass(Chofer);
