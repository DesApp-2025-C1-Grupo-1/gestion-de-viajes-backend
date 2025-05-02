import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'tipo_vehiculo' })
export class TipoVehiculo extends Document {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  descripcion: string;
}

export const TipoVehiculoSchema = SchemaFactory.createForClass(TipoVehiculo);
