import { Injectable } from '@nestjs/common';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vehiculo, VehiculoDocument } from './schemas/vehiculo.schema';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class VehiculoService {
  constructor(
    @InjectModel(Vehiculo.name) private vehiculoModel: Model<VehiculoDocument>,
  ) {}

  async create(createVehiculoDto: CreateVehiculoDto): Promise<Vehiculo> {
    const createdVehiculo = new this.vehiculoModel(createVehiculoDto);
    return createdVehiculo.save();
  }

  async findAll(): Promise<Vehiculo[]> {
    return (
      this.vehiculoModel
        .find()
        .populate('tipo')
        .populate('empresa')
        .exec()
    );
  }

  async findOne(id: string): Promise<Vehiculo> {
    const vehiculo = await this.vehiculoModel
      .findById(id)
      .populate('tipo')
      .populate('empresa')
      .exec();
    if (!vehiculo) {
      throw new NotFoundException(`Vehiculo with id ${id} not found`);
    }
    return vehiculo;
  }

  async update(
    id: string,
    updateVehiculoDto: UpdateVehiculoDto,
  ): Promise<Vehiculo> {
    const updatedVehiculo = await this.vehiculoModel
      .findByIdAndUpdate(id, updateVehiculoDto, { new: true })
      .exec();

    if (!updatedVehiculo) {
      throw new NotFoundException(`Vehiculo with id ${id} not found`);
    }

    return updatedVehiculo;
  }

  async remove(id: string): Promise<Vehiculo> {
    const deletedVehiculo = await this.vehiculoModel
      .findByIdAndDelete(id)
      .exec();

    if (!deletedVehiculo) {
      throw new NotFoundException(`Vehiculo with id ${id} not found`);
    }

    return deletedVehiculo;
  }
}
