import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import { Telefono, TelefonoSchema } from 'src/telefono/schemas/telefono.schema';

export type ChoferDocument = Chofer & Document;

@Schema({ collection: 'chofer', versionKey: false })
export class Chofer {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  apellido: string;

  @Prop({ required: true, unique: true })
  dni: number;

  @Prop({ type: Date, required: true })
  fecha_nacimiento: Date;

  @Prop({ required: true })
  licencia: string;

  @Prop({ required: true })
  tipo_licencia: string;

  @Prop({ required: true })
  email: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Vehiculo',
    required: true,
  })
  vehiculo: ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Empresa', required: true })
  empresa: ObjectId;

  @Prop({ type: TelefonoSchema, required: true })
  telefono: Telefono;
}

export const ChoferSchema = SchemaFactory.createForClass(Chofer);
