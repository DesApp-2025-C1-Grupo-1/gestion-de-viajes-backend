import { ConflictException, Injectable } from '@nestjs/common';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Vehiculo, VehiculoDocument } from './schemas/vehiculo.schema';
import { Chofer, ChoferDocument } from 'src/chofer/schemas/chofer.schema';
import { NotFoundException } from '@nestjs/common';
import { Viaje, ViajeDocument } from 'src/viaje/schemas/viaje.schema';
import {
  ViajeDistribucion,
  ViajeDistribucionDocument,
} from 'src/viaje_distribucion/schemas/viaje-distribucion.schema';

@Injectable()
export class VehiculoService {
  constructor(
    @InjectModel(Vehiculo.name) private vehiculoModel: Model<VehiculoDocument>,
    @InjectModel(Chofer.name) private choferModel: Model<ChoferDocument>,
    @InjectModel(Viaje.name) private viajeModel: Model<ViajeDocument>,
    @InjectModel(ViajeDistribucion.name)
    private viajeDistribucionModel: Model<ViajeDistribucionDocument>,
  ) {}
  async create(createVehiculoDto: CreateVehiculoDto): Promise<Vehiculo> {
    const { patente } = createVehiculoDto;

    const vehiculoExistente = await this.vehiculoModel.findOne({
      patente,
      deletedAt: null,
    });
    if (vehiculoExistente) {
      throw new ConflictException('Ya existe una Vehículo con esa patente');
    }

    const createdVehiculo = new this.vehiculoModel(createVehiculoDto);
    return createdVehiculo.save();
  }

  async findAll(): Promise<Vehiculo[]> {
    return this.vehiculoModel
      .find({ deletedAt: null })
      .populate('tipo')
      .populate('empresa')
      .exec();
  }

  async findOne(id: string): Promise<Vehiculo> {
    const vehiculo = await this.vehiculoModel
      .findOne({ _id: id, deletedAt: null })
      .populate('tipo')
      .populate('empresa')
      .exec();
    if (!vehiculo) {
      throw new NotFoundException(`Vehiculo no encontrado`);
    }
    return vehiculo;
  }
  async update(
    id: string,
    updateVehiculoDto: UpdateVehiculoDto,
  ): Promise<Vehiculo> {
    const { patente } = updateVehiculoDto;

    const vehiculoExistente = await this.vehiculoModel.findOne({
      patente,
      deletedAt: null,
    });

    if (vehiculoExistente && vehiculoExistente.id !== id.toString()) {
      //importante pasar el id a string (id.toString()), es un ObjectId por defecto, sinó siempre da true
      throw new ConflictException('Ya existe un vehículo con esa patente');
    }

    const updatedVehiculo = await this.vehiculoModel
      .findOneAndUpdate({ _id: id, deletedAt: null }, updateVehiculoDto, {
        new: true,
      })
      .exec();

    if (!updatedVehiculo) {
      throw new NotFoundException(`Vehiculo no encontrado`);
    }

    return updatedVehiculo;
  }

  async remove(id: string): Promise<Vehiculo> {
    const vehiculoEnUsoPorChofer = await this.choferModel.exists({
      vehiculo: new Types.ObjectId(id),
      deletedAt: null,
    });

    const vehiculoEnUsoPorViaje = await this.viajeModel.exists({
      vehiculo: new Types.ObjectId(id),
      deletedAt: null,
    });

    const empresaEnUsoPorViajeDistribucion =
      await this.viajeDistribucionModel.exists({
        transportista: new Types.ObjectId(id),
        deletedAt: null,
      });

    if (vehiculoEnUsoPorChofer) {
      throw new ConflictException(
        'No se puede eliminar: hay choferes que utilizan este vehículo',
      );
    }

    if (vehiculoEnUsoPorViaje) {
      throw new ConflictException(
        'No se puede eliminar: hay viajes punta a punta que utilizan este vehículo',
      );
    }

    if (empresaEnUsoPorViajeDistribucion) {
      throw new ConflictException(
        'No se puede eliminar: hay viajes de distribución que utilizan este vehículo',
      );
    }

    const deletedVehiculo = await this.vehiculoModel
      .findOneAndUpdate(
        { _id: id, deletedAt: null },
        { deletedAt: new Date() },
        { new: true },
      )
      .exec();

    if (!deletedVehiculo) {
      throw new NotFoundException(`Vehiculo no encontrado`);
    }

    return deletedVehiculo;
  }
}
