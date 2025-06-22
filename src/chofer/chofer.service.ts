import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateChoferDto } from './dto/create-chofer.dto';
import { UpdateChoferDto } from './dto/update-chofer.dto';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Chofer, ChoferDocument } from './schemas/chofer.schema';
import {
  Vehiculo,
  VehiculoDocument,
} from 'src/vehiculo/schemas/vehiculo.schema';
import { Viaje, ViajeDocument } from 'src/viaje/schemas/viaje.schema';

@Injectable()
export class ChoferService {
  constructor(
    @InjectModel(Chofer.name)
    private choferModel: mongoose.Model<ChoferDocument>,
    @InjectModel(Vehiculo.name)
    private vehiculoModel: mongoose.Model<VehiculoDocument>,
    @InjectModel(Viaje.name) private viajeModel: mongoose.Model<ViajeDocument>,
  ) {}
  async create(createChoferDto: CreateChoferDto) {
    const { dni, vehiculo, empresa } = createChoferDto;

    // Validar si ya existe un chofer con ese DNI
    const choferExistente = await this.choferModel.findOne({
      dni,
      deletedAt: null,
    });
    if (choferExistente) {
      throw new ConflictException('Ya existe un Chofer con ese DNI');
    }

    // Validar coincidencia entre vehículo y empresa
    const vehiculoEncontrado = await this.vehiculoModel.findOne({
      _id: vehiculo,
      deletedAt: null,
    });

    if (!vehiculoEncontrado) {
      throw new NotFoundException('El vehículo no existe');
    }

    if (vehiculoEncontrado.empresa.toString() !== empresa.toString()) {
      throw new ConflictException(
        'El vehículo no pertenece a la misma empresa que el chofer',
      );
    }

    const chofer = new this.choferModel(createChoferDto);
    return chofer.save();
  }
  async findAll(): Promise<Chofer[]> {
    return this.choferModel
      .find({ deletedAt: null })
      .populate('empresa')
      .populate('vehiculo')
      .exec();
  }

  async findOne(id: string): Promise<Chofer> {
    const chofer = await this.choferModel
      .findOne({ _id: id, deletedAt: null })
      .populate('empresa')
      .populate('vehiculo')
      .exec();
    if (!chofer) {
      throw new NotFoundException(`Chofer no encontrado`);
    }
    return chofer;
  }
  async update(id: string, updateChoferDto: UpdateChoferDto): Promise<Chofer> {
    const { dni, vehiculo, empresa } = updateChoferDto;

    const choferExistente = await this.choferModel.findOne({
      dni,
      deletedAt: null,
    });
    if (choferExistente && choferExistente.id !== id) {
      throw new ConflictException('Ya existe un Chofer con ese DNI');
    }

    // Validar coincidencia entre vehículo y empresa (solo si se mandan)
    if (vehiculo && empresa) {
      const vehiculoEncontrado = await this.vehiculoModel.findOne({
        _id: vehiculo,
        deletedAt: null,
      });
      if (!vehiculoEncontrado) {
        throw new NotFoundException('El vehículo no existe');
      }
      if (vehiculoEncontrado.empresa.toString() !== empresa.toString()) {
        throw new ConflictException(
          'El vehículo no pertenece a la misma empresa que el chofer',
        );
      }
    }

    const chofer = await this.choferModel
      .findOneAndUpdate({ _id: id, deletedAt: null }, updateChoferDto, {
        new: true,
      })
      .exec();

    if (!chofer) {
      throw new NotFoundException(`Chofer no encontrado`);
    }

    return chofer;
  }
  async remove(id: string): Promise<Chofer> {
    const choferEnUsoPorViaje = await this.viajeModel.exists({
      chofer: id,
      deletedAt: null,
    });

    if (choferEnUsoPorViaje) {
      throw new ConflictException(
        'No se puede eliminar: hay viajes que usan este chofer',
      );
    }

    const chofer = await this.choferModel
      .findOneAndUpdate(
        { _id: id, deletedAt: null },
        { deletedAt: new Date() },
        { new: true },
      )
      .exec();

    if (!chofer) {
      throw new NotFoundException(`Chofer no encontrado`);
    }
    return chofer;
  }
}
