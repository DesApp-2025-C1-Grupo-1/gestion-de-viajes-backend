import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateDireccionDto } from './dto/create-direccion.dto';
import { UpdateDireccionDto } from './dto/update-direccion.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Direccion, DireccionDocument } from './Schemas/direccion.schema';
import {
  Deposito,
  DepositoDocument,
} from 'src/deposito/Schemas/deposito.schema';
import { Empresa, EmpresaDocument } from 'src/empresa/schemas/empresa.schema';

@Injectable()
export class DireccionService {
  constructor(
    @InjectModel(Direccion.name)
    private DireccionModel: Model<DireccionDocument>,
    @InjectModel(Deposito.name) private depositoModel: Model<DepositoDocument>,
    @InjectModel(Empresa.name) private empresaModel: Model<EmpresaDocument>,
  ) {}

  async create(createDireccionDto: CreateDireccionDto): Promise<Direccion> {
    const { calle, numero, ciudad, estado_provincia, pais } =
      createDireccionDto;

    const direccionExistente = await this.DireccionModel.findOne({
      calle: new RegExp(`^${calle}$`, 'i'),
      numero: new RegExp(`^${numero}$`, 'i'),
      ciudad: new RegExp(`^${ciudad}$`, 'i'),
      estado_provincia: new RegExp(`^${estado_provincia}$`, 'i'),
      pais: new RegExp(`^${pais}$`, 'i'),
    });

    if (direccionExistente) {
      throw new ConflictException('La dirección ya está registrada.');
    }

    const nuevaDireccion = new this.DireccionModel(createDireccionDto);
    return nuevaDireccion.save();
  }

  async findAll(): Promise<Direccion[]> {
    const direcciones = await this.DireccionModel.find().exec();
    return direcciones;
  }

  async findOne(id: string): Promise<Direccion> {
    const direccionExistente = await this.DireccionModel.findById(id);
    if (!direccionExistente) {
      throw new NotFoundException(`Direccion with id ${id} not found`);
    }
    return direccionExistente;
  }

  async update(
    id: string,
    updateDireccionDto: UpdateDireccionDto,
  ): Promise<Direccion> {
    const { calle, numero, ciudad, estado_provincia, pais } =
      updateDireccionDto;

    const direccionDuplicada = await this.DireccionModel.findOne({
      _id: { $ne: id },
      calle: new RegExp(`^${calle}$`, 'i'),
      numero: new RegExp(`^${numero}$`, 'i'),
      ciudad: new RegExp(`^${ciudad}$`, 'i'),
      estado_provincia: new RegExp(`^${estado_provincia}$`, 'i'),
      pais: new RegExp(`^${pais}$`, 'i'),
    });

    if (direccionDuplicada) {
      throw new ConflictException(
        'Otra dirección con los mismos datos ya existe.',
      );
    }

    const direccionActualizada = await this.DireccionModel.findByIdAndUpdate(
      id,
      updateDireccionDto,
      { new: true },
    );

    if (!direccionActualizada) {
      throw new NotFoundException(`Dirección con id ${id} no encontrada`);
    }

    return direccionActualizada;
  }

  async remove(id: string): Promise<Direccion> {
    const usadaEnDeposito = await this.depositoModel.exists({ direccion: id });
    if (usadaEnDeposito) {
      throw new ConflictException(
        'No se puede eliminar la dirección: está en uso por un depósito.',
      );
    }

    const usadaEnEmpresa = await this.empresaModel.exists({ direccion: id });
    if (usadaEnEmpresa) {
      throw new ConflictException(
        'No se puede eliminar la dirección: está en uso por una empresa.',
      );
    }

    const direccionEliminada = await this.DireccionModel.findByIdAndDelete(id);
    if (!direccionEliminada) {
      throw new NotFoundException(`Dirección con id ${id} no encontrada`);
    }

    return direccionEliminada;
  }
}
