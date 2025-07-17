import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateTipoVehiculoDto } from './dto/create-tipo_vehiculo.dto';
import { UpdateTipoVehiculoDto } from './dto/update-tipo_vehiculo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  TipoVehiculo,
  TipoVehiculoDocument,
} from './schemas/tipo_vehiculo.schema';
import {
  Vehiculo,
  VehiculoDocument,
} from 'src/vehiculo/schemas/vehiculo.schema';

@Injectable()
export class TipoVehiculoService {
  constructor(
    @InjectModel(TipoVehiculo.name)
    private readonly tipoVehiculoModel: Model<TipoVehiculoDocument>,
    @InjectModel(Vehiculo.name) private vehiculoModel: Model<VehiculoDocument>,
  ) {}

  async create(
    createTipoVehiculoDto: CreateTipoVehiculoDto,
  ): Promise<TipoVehiculo> {
    const { nombre, descripcion, licencia_permitida } = createTipoVehiculoDto;

    const tipoExistente = await this.tipoVehiculoModel.findOne({
      nombre,
      deletedAt: null,
    });
    if (tipoExistente) {
      // importante pasar el id a string (id.toString()), es un ObjectId por defecto, sinó siempre da true
      throw new ConflictException(
        'Ya existe un tipo de vehiculo con ese nombre',
      );
    }

    const createdTipoVehiculo = new this.tipoVehiculoModel({
      nombre,
      descripcion,
      licencia_permitida: licencia_permitida,
    });
    return createdTipoVehiculo.save();
  }

  async findAll(): Promise<TipoVehiculo[]> {
    return this.tipoVehiculoModel.find({ deletedAt: null }).exec();
  }

  async findOne(id: string): Promise<TipoVehiculo> {
    const tipoVehiculo = await this.tipoVehiculoModel
      .findOne({ _id: id, deletedAt: null })
      .exec();
    if (!tipoVehiculo) {
      throw new NotFoundException(`TipoVehiculo no encontrado`);
    }
    return tipoVehiculo;
  }
  async update(
    id: string,
    updateTipoVehiculoDto: UpdateTipoVehiculoDto,
  ): Promise<TipoVehiculo> {
    const { nombre, descripcion, licencia_permitida } = updateTipoVehiculoDto;

    const tipoVehiculoToUpdate = await this.tipoVehiculoModel.findOne({
      _id: id,
      deletedAt: null,
    });
    if (!tipoVehiculoToUpdate) {
      throw new NotFoundException(
        `Tipo de vehículo con ID ${id} no encontrado.`,
      );
    }

    const tipoExistente = await this.tipoVehiculoModel.findOne({
      nombre,
      deletedAt: null,
    });
    if (tipoExistente && tipoExistente.id !== id.toString()) {
      // importante pasar el id a string (id.toString()), es un ObjectId por defecto, sinó siempre da true
      throw new ConflictException(
        'Ya existe un tipo de vehiculo con ese nombre',
      );
    }

    const licenciasParaGuardar = licencia_permitida;

    if (!licencia_permitida) {
      throw new BadRequestException(
        `La licencia requerida '${licencia_permitida}' no es válida.`,
      );
    }

    const updateFields: UpdateTipoVehiculoDto = {};
    if (nombre !== undefined) updateFields.nombre = nombre;
    if (descripcion !== undefined) updateFields.descripcion = descripcion;
    if (licencia_permitida !== undefined)
      updateFields.licencia_permitida = licenciasParaGuardar;

    const updatedTipoVehiculo = await this.tipoVehiculoModel
      .findOneAndUpdate({ _id: id, deletedAt: null }, updateFields, {
        new: true,
      })
      .exec();

    if (!updatedTipoVehiculo) {
      throw new NotFoundException('TipoVehiculo no encontrado');
    }

    return updatedTipoVehiculo;
  }

  async remove(id: string): Promise<TipoVehiculo> {
    const tipoVehiculoEnUsoPorVehiculo = await this.vehiculoModel.exists({
      tipo: new Types.ObjectId(id),
      deletedAt: null,
    });

    if (tipoVehiculoEnUsoPorVehiculo) {
      throw new ConflictException(
        'No se puede eliminar: hay vehículos que usan este tipo de vehículo',
      );
    }

    const deletedTipoVehiculo = await this.tipoVehiculoModel
      .findOneAndUpdate(
        { _id: id, deletedAt: null },
        { deletedAt: new Date() },
        { new: true },
      )
      .exec();

    if (!deletedTipoVehiculo) {
      throw new NotFoundException('TipoVehiculo no encontrado');
    }

    return deletedTipoVehiculo;
  }
}
