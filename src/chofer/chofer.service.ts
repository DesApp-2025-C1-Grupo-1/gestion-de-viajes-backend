import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
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
import {
  TipoVehiculo,
  TipoVehiculoDocument,
} from 'src/tipo_vehiculo/schemas/tipo_vehiculo.schema';
import { validateLicenseCompatibility } from '../common/function/licencias';
import { Types } from 'mongoose';
import {
  ViajeDistribucion,
  ViajeDistribucionDocument,
} from 'src/viaje_distribucion/schemas/viaje-distribucion.schema';

@Injectable()
export class ChoferService {
  constructor(
    @InjectModel(Chofer.name)
    private choferModel: mongoose.Model<ChoferDocument>,
    @InjectModel(Vehiculo.name)
    private vehiculoModel: mongoose.Model<VehiculoDocument>,
    @InjectModel(Viaje.name) private viajeModel: mongoose.Model<ViajeDocument>,
    @InjectModel(ViajeDistribucion.name)
    private viajeDistribucionModel: mongoose.Model<ViajeDistribucionDocument>,
    @InjectModel(TipoVehiculo.name)
    private tipoVehiculoModel: mongoose.Model<TipoVehiculoDocument>,
  ) {}
  async create(createChoferDto: CreateChoferDto) {
    const { dni, vehiculo, empresa, tipo_licencia } = createChoferDto;

    // Validar si ya existe un chofer con ese DNI
    const choferExistente = await this.choferModel.findOne({
      dni,
      deletedAt: null,
    });
    if (choferExistente) {
      throw new ConflictException('Ya existe un Chofer con ese DNI');
    }

    // Validar coincidencia entre vehículo y empresa
    const vehiculoEncontrado = await this.vehiculoModel
      .findOne({
        _id: vehiculo,
        deletedAt: null,
      })
      .populate<{ tipo: TipoVehiculoDocument }>('tipo');

    if (!vehiculoEncontrado) {
      throw new NotFoundException('El vehículo no existe');
    }

    if (vehiculoEncontrado.empresa.toString() !== empresa.toString()) {
      throw new ConflictException(
        'El vehículo no pertenece a la misma empresa que el chofer',
      );
    }

    const tipoVehiculoDelVehiculo = vehiculoEncontrado.tipo;
    if (
      !tipoVehiculoDelVehiculo ||
      !tipoVehiculoDelVehiculo.licencia_permitida
    ) {
      throw new NotFoundException(
        'El tipo de vehículo asociado al vehículo no tiene licencias permitidas definidas.',
      );
    }
    const esLicenciaCompatible = validateLicenseCompatibility(
      tipoVehiculoDelVehiculo.licencia_permitida,
      tipo_licencia,
    );
    if (!esLicenciaCompatible) {
      throw new BadRequestException(
        `La licencia del chofer no es compatible con la licencia requerida por el vehículo.`,
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
    const { dni, vehiculo, empresa, tipo_licencia } = updateChoferDto;

    const choferExistente = await this.choferModel.findOne({
      _id: id,
      deletedAt: null,
    });
    if (!choferExistente) {
      throw new NotFoundException(`Chofer con ID ${id} no encontrado`);
    }

    if (dni && dni !== choferExistente.dni) {
      const choferConDni = await this.choferModel.findOne({
        dni,
        deletedAt: null,
      });
      if (choferConDni) {
        throw new ConflictException('Ya existe otro Chofer con ese DNI');
      }
    }
    const vehiculoId = vehiculo || choferExistente.vehiculo;
    const empresaId = empresa || choferExistente.empresa;

    // Validar coincidencia entre vehículo y empresa (solo si se mandan)

    if (vehiculoId && empresaId) {
      const vehiculoEncontrado = await this.vehiculoModel
        .findOne({
          _id: vehiculoId,
          deletedAt: null,
        })
        .populate<{ tipo: TipoVehiculoDocument }>('tipo');

      if (!vehiculoEncontrado) {
        throw new NotFoundException('El vehículo asignado no existe.');
      }

      if (vehiculoEncontrado.empresa.toString() !== empresaId.toString()) {
        throw new ConflictException(
          'El vehículo no pertenece a la misma empresa que el chofer.',
        );
      }
      //
      const licenciaChofer = tipo_licencia || choferExistente.tipo_licencia;
      if (licenciaChofer) {
        const tipoVehiculoDelVehiculo = vehiculoEncontrado.tipo;

        if (
          !tipoVehiculoDelVehiculo ||
          !tipoVehiculoDelVehiculo.licencia_permitida
        ) {
          throw new NotFoundException(
            'El tipo de vehículo asociado al vehículo no tiene licencias permitidas definidas.',
          );
        }

        const esLicenciaCompatible = validateLicenseCompatibility(
          tipoVehiculoDelVehiculo.licencia_permitida,
          licenciaChofer,
        );

        if (!esLicenciaCompatible) {
          throw new BadRequestException(
            `La licencia del chofer no es compatible con las licencia requerida por el vehículo.`,
          );
        }
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
      chofer: new Types.ObjectId(id),
      deletedAt: null,
    });

    const choferEnUsoPorViajeDistribucion =
      await this.viajeDistribucionModel.exists({
        chofer: new Types.ObjectId(id),
        deletedAt: null,
      });

    if (choferEnUsoPorViaje) {
      throw new ConflictException(
        'No se puede eliminar: hay viajes punta a punta que utilizan este chofer',
      );
    }

    if (choferEnUsoPorViajeDistribucion) {
      throw new ConflictException(
        'No se puede eliminar: hay viajes de distribucion que utilizan este chofer',
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
