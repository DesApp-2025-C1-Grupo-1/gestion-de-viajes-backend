import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Empresa, EmpresaDocument } from './schemas/empresa.schema';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import {
  Vehiculo,
  VehiculoDocument,
} from 'src/vehiculo/schemas/vehiculo.schema';
import { Chofer, ChoferDocument } from 'src/chofer/schemas/chofer.schema';
import { Viaje, ViajeDocument } from 'src/viaje/schemas/viaje.schema';

@Injectable()
export class EmpresaService {
  constructor(
    @InjectModel(Empresa.name) private empresaModel: Model<EmpresaDocument>,
    @InjectModel(Vehiculo.name) private vehiculoModel: Model<VehiculoDocument>,
    @InjectModel(Chofer.name) private choferModel: Model<ChoferDocument>,
    @InjectModel(Viaje.name) private viajeModel: Model<ViajeDocument>,
  ) {}

  async findAll(): Promise<Empresa[]> {
    return this.empresaModel.find().exec();
  }

  async findOne(id: string): Promise<Empresa | null> {
    return this.empresaModel.findById(id).exec();
  }

  async create(createEmpresaDto: CreateEmpresaDto): Promise<Empresa> {
    const { cuit } = createEmpresaDto;

    const empresaExistente = await this.empresaModel.findOne({ cuit });
    if (empresaExistente) {
      throw new ConflictException('Ya existe una empresa con ese CUIT');
    }

    const created = new this.empresaModel(createEmpresaDto);
    return created.save();
  }

  async update(
    id: string,
    updateEmpresaDto: UpdateEmpresaDto,
  ): Promise<Empresa | null> {
    const { cuit } = updateEmpresaDto;

    const empresaExistente = await this.empresaModel.findOne({ cuit });
    if (empresaExistente && empresaExistente.id !== id.toString()) {
      // importante pasar el id a string (id.toString()), es un ObjectId por defecto, sinó siempre da true
      throw new ConflictException('Ya existe una empresa con ese CUIT');
    }

    return this.empresaModel
      .findByIdAndUpdate(id, updateEmpresaDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const empresaEnUsoPorVehiculo = await this.vehiculoModel.exists({
      empresa: id,
    });

    const empresaEnUsoPorChofer = await this.choferModel.exists({
      empresa: id,
    });

    const empresaEnUsoPorViaje = await this.viajeModel.exists({
      empresa: id,
    });

    if (empresaEnUsoPorVehiculo) {
      throw new ConflictException(
        'No se puede eliminar: hay vehículos que usan esta empresa',
      );
    }

    if (empresaEnUsoPorChofer) {
      throw new ConflictException(
        'No se puede eliminar: hay choferes que usan esta empresa',
      );
    }

    if (empresaEnUsoPorViaje) {
      throw new ConflictException(
        'No se puede eliminar: hay viajes que usan esta empresa',
      );
    }

    const res = await this.empresaModel.findByIdAndDelete(id).exec();
    return !!res;
  }
}
