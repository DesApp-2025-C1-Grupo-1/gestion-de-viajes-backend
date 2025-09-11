import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateViajeDistribucionDto } from './dto/create-viaje-distribucion.dto';
import { UpdateViajeDistribucionDto } from './dto/update-viaje-distribucion.dto';
import {
  ViajeDistribucion,
  ViajeDistribucionDocument,
} from './schemas/viaje-distribucion.schema';

@Injectable()
export class ViajeDistribucionService {
  constructor(
    @InjectModel(ViajeDistribucion.name)
    private viajeDistribucionModel: Model<ViajeDistribucionDocument>,
  ) {}

  async create(
    createViajeDistribucionDto: CreateViajeDistribucionDto,
  ): Promise<ViajeDistribucion> {
    const createdViajeDistribucion = new this.viajeDistribucionModel(
      createViajeDistribucionDto,
    );
    return createdViajeDistribucion.save();
  }

  async findAll(): Promise<ViajeDistribucion[]> {
    return this.viajeDistribucionModel
      .find({ deletedAt: null })
      .populate('origen')
      .populate('chofer')
      .populate('transportista')
      .populate('vehiculo')
      .exec();
  }

  async findOne(id: string): Promise<ViajeDistribucion> {
    const viajeDistribucion = await this.viajeDistribucionModel
      .findOne({ _id: id, deletedAt: null })
      .populate('origen')
      .populate('chofer')
      .populate('transportista')
      .populate('vehiculo')
      .exec();

    if (!viajeDistribucion) {
      throw new NotFoundException(
        `Viaje de distribución con ID ${id} no encontrado`,
      );
    }

    return viajeDistribucion;
  }

  async findByEstado(estado: string): Promise<ViajeDistribucion[]> {
    return this.viajeDistribucionModel
      .find({ estado, deletedAt: null })
      .populate('origen')
      .populate('chofer')
      .populate('transportista')
      .populate('vehiculo')
      .exec();
  }

  async update(
    id: string,
    updateViajeDistribucionDto: UpdateViajeDistribucionDto,
  ): Promise<ViajeDistribucion> {
    const updatedViajeDistribucion = await this.viajeDistribucionModel
      .findOneAndUpdate(
        { _id: id, deletedAt: null },
        updateViajeDistribucionDto,
        { new: true },
      )
      .populate('origen')
      .populate('chofer')
      .populate('transportista')
      .populate('vehiculo')
      .exec();

    if (!updatedViajeDistribucion) {
      throw new NotFoundException(
        `Viaje de distribución con ID ${id} no encontrado`,
      );
    }

    return updatedViajeDistribucion;
  }

  async remove(id: string): Promise<void> {
    const result = await this.viajeDistribucionModel
      .findOneAndUpdate(
        { _id: id, deletedAt: null },
        { deletedAt: new Date() },
        { new: true },
      )
      .exec();

    if (!result) {
      throw new NotFoundException(
        `Viaje de distribución con ID ${id} no encontrado`,
      );
    }
  }

  async updateEstado(
    id: string,
    nuevoEstado: string,
  ): Promise<ViajeDistribucion> {
    const updatedViajeDistribucion = await this.viajeDistribucionModel
      .findOneAndUpdate(
        { _id: id, deletedAt: null },
        { estado: nuevoEstado },
        { new: true },
      )
      .populate('origen')
      .populate('chofer')
      .populate('transportista')
      .populate('vehiculo')
      .exec();

    if (!updatedViajeDistribucion) {
      throw new NotFoundException(
        `Viaje de distribución con ID ${id} no encontrado`,
      );
    }

    return updatedViajeDistribucion;
  }
}
