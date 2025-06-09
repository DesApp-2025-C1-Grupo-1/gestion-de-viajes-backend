import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateViajeDto } from './dto/create-viaje.dto';
import { UpdateViajeDto } from './dto/update-viaje.dto';
import { Viaje, ViajeDocument } from './schemas/viaje.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Chofer, ChoferDocument } from 'src/chofer/schemas/chofer.schema';
import { Model } from 'mongoose';
import { Empresa, EmpresaDocument } from 'src/empresa/schemas/empresa.schema';
import {
  Vehiculo,
  VehiculoDocument,
} from 'src/vehiculo/schemas/vehiculo.schema';
import {
  Deposito,
  DepositoDocument,
} from 'src/deposito/Schemas/deposito.schema';
import { PaginacionDto } from 'src/common/dto/paginacion.dto';

@Injectable()
export class ViajeService {
  constructor(
    @InjectModel(Viaje.name) private viajeModel: Model<ViajeDocument>,
    @InjectModel(Deposito.name) private depositoModel: Model<DepositoDocument>,
    @InjectModel(Empresa.name) private empresaModel: Model<EmpresaDocument>,
    @InjectModel(Vehiculo.name) private vehiculoModel: Model<VehiculoDocument>,
    @InjectModel(Chofer.name) private choferModel: Model<ChoferDocument>,
  ) {}

  async create(createViajeDto: CreateViajeDto): Promise<Viaje> {
    const {
      deposito_origen,
      fecha_inicio,
      fecha_llegada,
      chofer,
      vehiculo,
      empresa,
    } = createViajeDto;

    // Validar que el chofer no tenga un viaje asignado en el mismo rango horario
    const viajeSolapado = await this.viajeModel.findOne({
      chofer: createViajeDto.chofer,
      fecha_inicio: { $lt: createViajeDto.fecha_llegada },
      fecha_llegada: { $gt: createViajeDto.fecha_inicio },
    });

    if (viajeSolapado) {
      throw new ConflictException(
        'El chofer ya tiene asignado un viaje en ese rango horario',
      );
    }

    //valida que la fecha de inicio sea anterior a la fecha de llegada
    const inicio = new Date(fecha_inicio);
    const llegada = new Date(fecha_llegada);

    if (inicio >= llegada) {
      throw new BadRequestException(
        'La fecha de inicio debe ser anterior a la fecha de llegada',
      );
    }

    //Validar que no exista un viaje con los mismos datos
    const viajeExistente = await this.viajeModel.findOne({
      deposito_origen,
      fecha_inicio,
      chofer,
    });
    if (viajeExistente) {
      throw new ConflictException('Ya existe un Viaje con esos datos');
    }

    //Validar que chofer y vehiculo tengan el mismo id de empresa
    const vehiculoEncontrado = await this.vehiculoModel.findById(vehiculo);
    const choferEncontrado = await this.choferModel.findById(chofer);
    const empresaEncontrada = await this.empresaModel.findById(empresa);

    if (!vehiculoEncontrado) {
      throw new NotFoundException('El vehículo no existe');
    } else if (!choferEncontrado) {
      throw new NotFoundException('El chofer no existe');
    } else if (!empresaEncontrada) {
      throw new NotFoundException('La empresa no existe');
    }

    if (vehiculoEncontrado.empresa.toString() !== empresa.toString()) {
      throw new ConflictException(
        'El vehículo no pertenece a la misma empresa que el viaje',
      );

      // Este if da error, pero al testearno funciona sin problemas, lo raro es que el if anterior es igual y no da error.
      // desactivo el error por ahora
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
    } else if (choferEncontrado.empresa.toString() !== empresa.toString()) {
      throw new ConflictException(
        'El chofer no pertenece a la misma empresa que el viaje',
      );
    }

    const createdViaje = new this.viajeModel(createViajeDto);
    return createdViaje.save();
  }

  async findAll(paginacionDto: PaginacionDto): Promise<{
    data: Viaje[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10 } = paginacionDto;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.viajeModel
        .find()
        .skip(skip)
        .limit(limit)
        .populate('deposito_origen')
        .populate('deposito_destino')
        .populate('empresa')
        .populate('chofer')
        .populate('vehiculo')
        .exec(),
      this.viajeModel.countDocuments(),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Viaje> {
    const viaje = await this.viajeModel
      .findById(id)
      .populate('deposito_origen')
      .populate('deposito_destino')
      .populate('empresa')
      .populate('chofer')
      .populate('vehiculo')
      .exec();
    if (!viaje) {
      throw new NotFoundException(`Viaje no encontrado`);
    }
    return viaje;
  }

  async update(id: string, updateViajeDto: UpdateViajeDto): Promise<Viaje> {
    const {
      deposito_origen,
      fecha_inicio,
      fecha_llegada,
      chofer,
      vehiculo,
      empresa,
    } = updateViajeDto;

    const viajeExistente = await this.viajeModel.findOne({
      _id: { $ne: id },
      deposito_origen,
      fecha_inicio,
      chofer,
    });

    if (viajeExistente) {
      throw new ConflictException('Ya existe un Viaje con esos datos');
    }

    // Validar que la fecha de inicio sea anterior a la fecha de llegada
    const viajeActual = await this.viajeModel.findById(id);

    if (!viajeActual) {
      throw new NotFoundException('Viaje no encontrado');
    }

    const inicio = new Date(fecha_inicio ?? viajeActual.fecha_inicio);
    const llegada = new Date(fecha_llegada ?? viajeActual.fecha_llegada);

    if (inicio >= llegada) {
      throw new BadRequestException(
        'La fecha de inicio debe ser anterior a la fecha de llegada',
      );
    }

    // Validar que el chofer no tenga un viaje asignado en el mismo rango horario
    const viajeSolapado = await this.viajeModel.findOne({
      _id: { $ne: id },
      chofer: updateViajeDto.chofer,
      fecha_inicio: { $lt: fecha_llegada ?? viajeActual.fecha_llegada },
      fecha_llegada: { $gt: fecha_inicio ?? viajeActual.fecha_inicio },
    });

    if (viajeSolapado) {
      throw new ConflictException(
        'El chofer ya tiene asignado un viaje en ese rango horario',
      );
    }

    // Validar existencia de entidades
    const vehiculoEncontrado = await this.vehiculoModel.findById(vehiculo);
    const choferEncontrado = await this.choferModel.findById(chofer);
    const empresaEncontrada = await this.empresaModel.findById(empresa);

    if (!vehiculoEncontrado) {
      throw new NotFoundException('El vehículo no existe');
    } else if (!choferEncontrado) {
      throw new NotFoundException('El chofer no existe');
    } else if (!empresaEncontrada) {
      throw new NotFoundException('La empresa no existe');
    }

    if (
      !empresa ||
      vehiculoEncontrado.empresa.toString() !== empresa.toString()
    ) {
      throw new ConflictException(
        'El vehículo no pertenece a la misma empresa que el viaje',
      );
    }

    if (
      !empresa ||
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      choferEncontrado.empresa.toString() !== empresa.toString()
    ) {
      throw new ConflictException(
        'El chofer no pertenece a la misma empresa que el viaje',
      );
    }

    const viajeActualizado = await this.viajeModel.findByIdAndUpdate(
      id,
      { $set: updateViajeDto },
      { new: true },
    );

    if (!viajeActualizado) {
      throw new NotFoundException('Viaje no encontrado');
    }

    return viajeActualizado;
  }

  async remove(id: string): Promise<Viaje> {
    const viajeEliminado = await this.viajeModel.findByIdAndDelete(id);

    if (!viajeEliminado) {
      throw new NotFoundException('Viaje no encontrado');
    }

    return viajeEliminado;
  }
}
