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
    const choferExistente = await this.choferModel.findOne({ dni });
    if (choferExistente) {
      throw new ConflictException('Ya existe un Chofer con ese DNI');
    }

    // Validar coincidencia entre vehículo y empresa
    const vehiculoEncontrado = await this.vehiculoModel.findById(vehiculo);

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
      .find()
      .populate('empresa')
      .populate('vehiculo')
      .exec();
  }

  async findOne(id: string): Promise<Chofer> {
    const chofer = await this.choferModel
      .findById(id)
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

    const choferExistente = await this.choferModel.findOne({ dni });
    if (choferExistente && choferExistente.id !== id) {
      throw new ConflictException('Ya existe un Chofer con ese DNI');
    }

    // Validar coincidencia entre vehículo y empresa (solo si se mandan)
    if (vehiculo && empresa) {
      const vehiculoEncontrado = await this.vehiculoModel.findById(vehiculo);
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
      .findByIdAndUpdate(id, updateChoferDto, { new: true })
      .exec();

    if (!chofer) {
      throw new NotFoundException(`Chofer no encontrado`);
    }

    return chofer;
  }

  async remove(id: string): Promise<Chofer> {
    const depositoEnUsoPorViaje = await this.viajeModel.exists({
      empresa: id,
    });

    if (depositoEnUsoPorViaje) {
      throw new ConflictException(
        'No se puede eliminar: hay viajes que usan este deposito',
      );
    }

    const chofer = await this.choferModel.findByIdAndDelete(id).exec();
    if (!chofer) {
      throw new NotFoundException(`Chofer no encontrado`);
    }
    return chofer;
  }
}
