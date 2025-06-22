import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateDepositoDto } from './dto/create-deposito.dto';
import { UpdateDepositoDto } from './dto/update-deposito.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Deposito, DepositoDocument } from './Schemas/deposito.schema';
import { Viaje, ViajeDocument } from 'src/viaje/schemas/viaje.schema';

@Injectable()
export class DepositoService {
  constructor(
    @InjectModel(Deposito.name)
    private DepositoModel: Model<DepositoDocument>,
    @InjectModel(Viaje.name) private viajeModel: Model<ViajeDocument>,
  ) {}
  async create(createDepositoDto: CreateDepositoDto): Promise<Deposito> {
    const { lat, long } = createDepositoDto;
    const depositoExistente = await this.DepositoModel.findOne({
      lat,
      long,
      deletedAt: null,
    }).exec();

    if (depositoExistente) {
      throw new ConflictException(
        'Ya existe un depósito con esa latitud y longitud.',
      );
    }

    const deposito = new this.DepositoModel(createDepositoDto);
    return deposito.save();
  }

  async findAll(): Promise<Deposito[]> {
    const depositos = await this.DepositoModel.find({ deletedAt: null });
    return depositos;
  }
  async findOne(id: string): Promise<Deposito> {
    const deposito = await this.DepositoModel.findOne({
      _id: id,
      deletedAt: null,
    }).exec();
    if (!deposito) {
      throw new NotFoundException(`Deposito no encontrado`);
    }
    return deposito;
  }
  async update(
    id: string,
    updateDepositoDto: UpdateDepositoDto,
  ): Promise<Deposito> {
    const depositoExistente = await this.DepositoModel.findOne({
      _id: id,
      deletedAt: null,
    }).exec();
    if (!depositoExistente) {
      throw new NotFoundException(`Depósito no encontrado`);
    }

    const { lat, long } = updateDepositoDto;

    const newLat = lat !== undefined ? lat : depositoExistente.lat;
    const newLong = long !== undefined ? long : depositoExistente.long;

    if (
      newLat !== depositoExistente.lat ||
      newLong !== depositoExistente.long
    ) {
      const coordenadasDuplicadas = await this.DepositoModel.findOne({
        lat: newLat,
        long: newLong,
        deletedAt: null,
        _id: { $ne: depositoExistente._id },
      }).exec();

      if (coordenadasDuplicadas) {
        throw new ConflictException(
          'Ya existe un depósito con estas coordenadas.',
        );
      }
    }

    const depositoActualizado = await this.DepositoModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { ...updateDepositoDto, lat: newLat, long: newLong },
      { new: true, runValidators: true },
    ).exec();

    if (!depositoActualizado) {
      throw new NotFoundException(`Depósito no encontrado tras actualizar`);
    }

    return depositoActualizado;
  }
  async remove(id: string): Promise<Deposito> {
    const depositoEnUsoPorViaje = await this.viajeModel.exists({
      $or: [{ deposito_origen: id }, { deposito_destino: id }],
      deletedAt: null,
    });

    if (depositoEnUsoPorViaje) {
      throw new ConflictException(
        'No se puede eliminar: hay viajes que usan este deposito',
      );
    }

    const deposito = await this.DepositoModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { deletedAt: new Date() },
      { new: true },
    ).exec();

    if (!deposito) {
      throw new NotFoundException(`Deposito no encontrado`);
    }

    return deposito;
  }
}
