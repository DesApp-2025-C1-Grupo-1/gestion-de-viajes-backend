import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateTipoVehiculoDto } from './dto/create-tipo_vehiculo.dto';
import { UpdateTipoVehiculoDto } from './dto/update-tipo_vehiculo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  TipoVehiculo,
  TipoVehiculoDocument,
} from './schemas/tipo_vehiculo.schema';
import {
  Vehiculo,
  VehiculoDocument,
} from 'src/vehiculo/schemas/vehiculo.schema';
import { getLicenciasCompatibles } from '../common/function/licencias';

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
    const { nombre, descripcion, licencias_permitidas } = createTipoVehiculoDto;

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

    const licenciasCompletas = getLicenciasCompatibles(licencias_permitidas);
    if (licenciasCompletas.length === 0) {
      // Esto ocurrirá si licencias_permitidas no está en tu mapa
      throw new BadRequestException(
        `La licencia requerida '${licencias_permitidas}' no es válida o no tiene compatibilidades definidas.`,
      );
    }

    const createdTipoVehiculo = new this.tipoVehiculoModel({
      nombre,
      descripcion,
      licencias_permitidas: licenciasCompletas,
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
    const { nombre, descripcion, licencias_permitidas } = updateTipoVehiculoDto;

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

    let licenciasParaGuardar = tipoVehiculoToUpdate.licencias_permitidas;

    if (licencias_permitidas !== undefined) {
      const nuevasLicenciasCompletas =
        getLicenciasCompatibles(licencias_permitidas);
      if (nuevasLicenciasCompletas.length === 0) {
        throw new BadRequestException(
          `La licencia requerida '${licencias_permitidas}' no es válida o no tiene compatibilidades definidas.`,
        );
      }
      licenciasParaGuardar = nuevasLicenciasCompletas;
    }

    const updateFields: any = {};
    if (nombre !== undefined) updateFields.nombre = nombre;
    if (descripcion !== undefined) updateFields.descripcion = descripcion;
    if (licencias_permitidas !== undefined)
      updateFields.licencias_permitidas = licenciasParaGuardar;

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
      tipo: id,
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
