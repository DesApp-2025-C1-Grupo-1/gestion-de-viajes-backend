import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TipoVehiculoDocument = TipoVehiculo & Document;

@Schema({ collection: 'tipo_vehiculo' })
export class TipoVehiculo {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  descripcion: string;
}

export const TipoVehiculoSchema = SchemaFactory.createForClass(TipoVehiculo);
