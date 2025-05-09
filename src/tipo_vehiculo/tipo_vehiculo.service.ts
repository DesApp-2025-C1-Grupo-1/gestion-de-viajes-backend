import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTipoVehiculoDto } from './dto/create-tipo_vehiculo.dto';
import { UpdateTipoVehiculoDto } from './dto/update-tipo_vehiculo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TipoVehiculo } from './schemas/tipo_vehiculo.schema';

@Injectable()
export class TipoVehiculoService {
  constructor(
    @InjectModel(TipoVehiculo.name)
    private readonly tipoVehiculoModel: Model<TipoVehiculo>,
  ) {}

  async create(
    createTipoVehiculoDto: CreateTipoVehiculoDto,
  ): Promise<TipoVehiculo> {
    const nuevo = new this.tipoVehiculoModel(createTipoVehiculoDto);
    return nuevo.save();
  }

  async findAll(): Promise<TipoVehiculo[]> {
    return this.tipoVehiculoModel.find().exec();
  }

  async findOne(id: string): Promise<TipoVehiculo> {
    const tipoVehiculo = await this.tipoVehiculoModel.findById(id).exec();
    if (!tipoVehiculo) {
      throw new NotFoundException(`TipoVehiculo with id ${id} not found`);
    }
    return tipoVehiculo;
  }

  async update(
    id: string,
    updateTipoVehiculoDto: UpdateTipoVehiculoDto,
  ): Promise<TipoVehiculo> {
    const updatedTipoVehiculo = await this.tipoVehiculoModel
      .findByIdAndUpdate(id, updateTipoVehiculoDto, { new: true })
      .exec();

    if (!updatedTipoVehiculo) {
      throw new NotFoundException('TipoVehiculo no encontrado');
    }

    return updatedTipoVehiculo;
  }

  async remove(id: string): Promise<TipoVehiculo> {
    const deletedTipoVehiculo = await this.tipoVehiculoModel
      .findByIdAndDelete(id)
      .exec();

    if (!deletedTipoVehiculo) {
      throw new NotFoundException('TipoVehiculo no encontrado');
    }

    return deletedTipoVehiculo;
  }
}
