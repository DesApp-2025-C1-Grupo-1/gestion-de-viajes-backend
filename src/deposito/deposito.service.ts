import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateDepositoDto } from './dto/create-deposito.dto';
import { UpdateDepositoDto } from './dto/update-deposito.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Deposito, DepositoDocument } from './Schemas/deposito.schema';

@Injectable()
export class DepositoService {
  constructor(
    @InjectModel(Deposito.name)
    private DepositoModel: Model<DepositoDocument>,
  ) {}

  async create(createDepositoDto: CreateDepositoDto) {
    const { lat, long } = createDepositoDto;
    const depositoExistente = await this.DepositoModel.findOne({
      lat,
      long,
    }).exec();

    if (!depositoExistente) {
      throw new ConflictException(
        'Ya existe un Deposito con esa Longitud y Latitud',
      );
    }

    const deposito = new this.DepositoModel(createDepositoDto);
    return deposito.save();
  }

  async findAll(): Promise<Deposito[]> {
    const depositos = await this.DepositoModel.find();
    return depositos;
  }

  async findOne(id: string): Promise<Deposito> {
    const deposito = await this.DepositoModel.findById(id).exec();
    if (!deposito) {
      throw new NotFoundException(`Deposito with id ${id} not found`);
    }
    return deposito;
  }

  async update(
    id: string,
    updateDepositoDto: UpdateDepositoDto,
  ): Promise<Deposito> {
    const objectId = new Types.ObjectId(id);

    // Verifica que el depósito exista por ID
    const depositoExistente =
      await this.DepositoModel.findById(objectId).exec();
    if (!depositoExistente) {
      throw new NotFoundException(`Deposito no encontrado`);
    }

    const { lat, long } = updateDepositoDto;

    // Si están cambiando las coordenadas, verifica duplicados
    if (
      (lat !== undefined && lat !== depositoExistente.lat) ||
      (long !== undefined && long !== depositoExistente.long)
    ) {
      const coordenadasDuplicadas = await this.DepositoModel.findOne({
        lat,
        long,
        _id: { $ne: objectId },
      }).exec();

      if (coordenadasDuplicadas) {
        throw new ConflictException(
          'Ya existe un deposito con estas coordenadas.',
        );
      }
    }

    const depositoActualizado = await this.DepositoModel.findByIdAndUpdate(
      objectId,
      updateDepositoDto,
      { new: true },
    ).exec();

    if (!depositoActualizado) {
      throw new NotFoundException(`Deposito no encontrado tras actualizar`);
    }

    return depositoActualizado;
  }

  async remove(id: string): Promise<Deposito> {
    const deposito = await this.DepositoModel.findByIdAndDelete(id).exec();
    if (!deposito) {
      throw new NotFoundException(`Deposito with id ${id} not found`);
    }
    return deposito;
  }
}
