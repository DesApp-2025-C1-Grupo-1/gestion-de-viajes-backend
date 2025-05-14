import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChoferDto } from './dto/create-chofer.dto';
import { UpdateChoferDto } from './dto/update-chofer.dto';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Chofer, ChoferDocument } from './schemas/chofer.schema';

@Injectable()
export class ChoferService {
  constructor(
    @InjectModel(Chofer.name)
    private choferModel: mongoose.Model<ChoferDocument>,
  ) {}

  async create(createChoferDto: CreateChoferDto) {
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
      throw new NotFoundException(`chofer with id ${id} not found`);
    }
    return chofer;
  }

  async update(id: string, updateChoferDto: UpdateChoferDto): Promise<Chofer> {
    const chofer = await this.choferModel
      .findByIdAndUpdate(id, updateChoferDto, { new: true })
      .exec();
    if (!chofer) {
      throw new NotFoundException(`chofer with id ${id} not found`);
    }
    return chofer;
  }

  async remove(id: string): Promise<Chofer> {
    const chofer = await this.choferModel.findByIdAndDelete(id).exec();
    if (!chofer) {
      throw new NotFoundException(`chofer with id ${id} not found`);
    }
    return chofer;
  }
}
