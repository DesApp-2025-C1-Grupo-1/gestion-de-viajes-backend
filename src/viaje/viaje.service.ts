/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
import { Model, RootFilterQuery, Types } from 'mongoose';
import { Empresa, EmpresaDocument } from 'src/empresa/schemas/empresa.schema';
import {
  Vehiculo,
  VehiculoDocument,
} from 'src/vehiculo/schemas/vehiculo.schema';
import {
  Deposito,
  DepositoDocument,
} from 'src/deposito/schemas/deposito.schema';
import { QueryPaginacionDto } from 'src/common/dto/query-paginacion.dto';
import { BuscarViajeDto } from './dto/buscar-viaje.dto';
import {
  TipoVehiculo,
  TipoVehiculoDocument,
} from 'src/tipo_vehiculo/schemas/tipo_vehiculo.schema';
import { validateLicenseCompatibility } from '../common/function/licencias';
import { DashboardResponseDto } from './dto/dashboard.dto';
import { ViajeDto } from './dto/viaje.dto';
import { startOfDay } from 'date-fns';
import { plainToInstance } from 'class-transformer';

const { ObjectId } = Types;

@Injectable()
export class ViajeService {
  constructor(
    @InjectModel(Viaje.name) private viajeModel: Model<ViajeDocument>,
    @InjectModel(Deposito.name) private depositoModel: Model<DepositoDocument>,
    @InjectModel(Empresa.name) private empresaModel: Model<EmpresaDocument>,
    @InjectModel(Vehiculo.name) private vehiculoModel: Model<VehiculoDocument>,
    @InjectModel(Chofer.name) private choferModel: Model<ChoferDocument>,
    @InjectModel(TipoVehiculo.name)
    private tipoVehiculoModel: Model<TipoVehiculoDocument>,
  ) {}

  async create(createViajeDto: CreateViajeDto): Promise<Viaje> {
    const {
      deposito_origen,
      deposito_destino,
      fecha_inicio,
      fecha_llegada,
      chofer,
      vehiculo,
      empresa,
    } = createViajeDto;

    //Validar que deposito de origen y destino no sean el mismo
    if (
      deposito_origen.toString().trim() === deposito_destino.toString().trim()
    ) {
      throw new ConflictException(
        'Los depósitos de origen y destino no pueden ser el mismo',
      );
    }

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
      deletedAt: null,
    });
    if (viajeExistente) {
      throw new ConflictException('Ya existe un Viaje con esos datos');
    }

    //Validar que chofer y vehiculo tengan el mismo id de empresa
    const vehiculoEncontrado = await this.vehiculoModel
      .findOne({
        _id: vehiculo,
        deletedAt: null,
      })
      .populate<{ tipo: TipoVehiculoDocument }>('tipo');
    const choferEncontrado = await this.choferModel.findOne({
      _id: chofer,
      deletedAt: null,
    });
    const empresaEncontrada = await this.empresaModel.findOne({
      _id: empresa,
      deletedAt: null,
    });

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

    // validacion de licencia
    if (!choferEncontrado.tipo_licencia) {
      throw new BadRequestException(
        'El chofer seleccionado no tiene un tipo de licencia definido.',
      );
    }
    const tipoVehiculoDelVehiculo = vehiculoEncontrado.tipo;
    if (
      !tipoVehiculoDelVehiculo ||
      !tipoVehiculoDelVehiculo.licencias_permitidas
    ) {
      throw new NotFoundException(
        'El tipo de vehículo asociado al vehículo no tiene licencias permitidas definidas.',
      );
    }

    const esLicenciaCompatible = validateLicenseCompatibility(
      choferEncontrado.tipo_licencia,
      tipoVehiculoDelVehiculo.licencias_permitidas,
    );

    if (!esLicenciaCompatible) {
      throw new BadRequestException(
        `La licencia del chofer (${choferEncontrado.tipo_licencia}) no es compatible con las licencias requeridas por el vehículo (${tipoVehiculoDelVehiculo.licencias_permitidas.join(', ')}).`,
      );
    }

    const createdViaje = new this.viajeModel(createViajeDto);
    return createdViaje.save();
  }
  async findAll(queryPaginacionDto: QueryPaginacionDto): Promise<{
    data: Viaje[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10 } = queryPaginacionDto;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.viajeModel
        .find({ deletedAt: null })
        .skip(skip)
        .limit(limit)
        .populate('deposito_origen')
        .populate('deposito_destino')
        .populate('empresa')
        .populate('chofer')
        .populate('vehiculo')
        .exec(),
      this.viajeModel.countDocuments({ deletedAt: null }),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Viaje> {
    const viaje = await this.viajeModel
      .findOne({ _id: id, deletedAt: null })
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

  async update(id: string, updateDto: UpdateViajeDto): Promise<Viaje> {
    // 1. Cargo el viaje actual
    const viajeActual = await this.viajeModel.findOne({
      _id: id,
      deletedAt: null,
    });
    if (!viajeActual) throw new NotFoundException('Viaje no encontrado');

    // 2. Desestructuro el DTO
    const {
      tipo_viaje,
      fecha_inicio,
      fecha_llegada,
      chofer: choferDto,
      vehiculo: vehiculoDto,
      empresa: empresaDto,
      deposito_origen: origenDto,
      deposito_destino: destinoDto,
    } = updateDto;

    // 3. Valores finales con fallback
    const choferId = choferDto ?? viajeActual.chofer;
    const vehiculoId = vehiculoDto ?? viajeActual.vehiculo;
    const empresaId = empresaDto ?? viajeActual.empresa;
    const fechaInicio = fecha_inicio ?? viajeActual.fecha_inicio;
    const fechaLlegada = fecha_llegada ?? viajeActual.fecha_llegada;
    const depositoOrigen = origenDto ?? viajeActual.deposito_origen;
    const depositoDestino = destinoDto ?? viajeActual.deposito_destino;

    // 4. Validaciones (rango de fechas, solapamientos, etc.)
    if (new Date(fechaInicio) >= new Date(fechaLlegada)) {
      throw new BadRequestException(
        'La fecha de inicio debe ser anterior a la fecha de llegada',
      );
    }
    const solapado = await this.viajeModel.findOne({
      _id: { $ne: id },
      chofer: choferId,
      fecha_inicio: { $lt: fechaLlegada },
      fecha_llegada: { $gt: fechaInicio },
      deletedAt: null,
    });
    if (solapado) {
      throw new ConflictException(
        'El chofer ya tiene asignado un viaje en ese rango horario',
      );
    }

    // 5. Validar existencia de entidades
    const vehObj = await this.vehiculoModel
      .findOne({
        _id: vehiculoId,
        deletedAt: null,
      })
      .populate<{ tipo: TipoVehiculoDocument }>('tipo');
    if (!vehObj) throw new NotFoundException('El vehículo no existe');
    const choObj = await this.choferModel.findOne({
      _id: choferId,
      deletedAt: null,
    });
    if (!choObj) throw new NotFoundException('El chofer no existe');
    const empObj = await this.empresaModel.findOne({
      _id: empresaId,
      deletedAt: null,
    });
    if (!empObj) throw new NotFoundException('La empresa no existe');

    // 6. Coherencia de empresa
    if (vehObj.empresa.toString() !== empresaId.toString()) {
      throw new ConflictException(
        'El vehículo no pertenece a la misma empresa que el viaje',
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    if (choObj.empresa.toString() !== empresaId.toString()) {
      throw new ConflictException(
        'El chofer no pertenece a la misma empresa que el viaje',
      );
    }

    // Validacion de licencias
    if (!choObj.tipo_licencia) {
      throw new BadRequestException(
        'El chofer seleccionado no tiene un tipo de licencia definido.',
      );
    }

    const tipoVehiculoDelVehiculo = vehObj.tipo;
    if (
      !tipoVehiculoDelVehiculo ||
      !tipoVehiculoDelVehiculo.licencias_permitidas
    ) {
      throw new NotFoundException(
        'El tipo de vehículo asociado al vehículo no tiene licencias permitidas definidas.',
      );
    }

    const esLicenciaCompatible = validateLicenseCompatibility(
      choObj.tipo_licencia,
      tipoVehiculoDelVehiculo.licencias_permitidas,
    );
    if (!esLicenciaCompatible) {
      throw new BadRequestException(
        `La licencia del chofer (${choObj.tipo_licencia}) no es compatible con las licencias requeridas por el vehículo (${tipoVehiculoDelVehiculo.licencias_permitidas.join(', ')}).`,
      );
    }
    // 7. Aplico sólo los cambios que vinieron
    const updated = await this.viajeModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      {
        ...(tipo_viaje !== undefined && { tipo_viaje }),
        ...(fecha_inicio && { fecha_inicio: fechaInicio }),
        ...(fecha_llegada && { fecha_llegada: fechaLlegada }),
        ...(updateDto.chofer && { chofer: new Types.ObjectId(choferId) }),
        ...(updateDto.vehiculo && { vehiculo: new Types.ObjectId(vehiculoId) }),
        ...(updateDto.empresa && { empresa: new Types.ObjectId(empresaId) }),
        ...(updateDto.deposito_origen && { depositoOrigen }),
        ...(updateDto.deposito_destino && { depositoDestino }),
      },
      { new: true },
    );

    if (!updated) throw new NotFoundException('Viaje no encontrado');
    return updated;
  }

  async remove(id: string): Promise<Viaje> {
    const viajeEliminado = await this.viajeModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { deletedAt: new Date() },
      { new: true },
    );

    if (!viajeEliminado) {
      throw new NotFoundException('Viaje no encontrado');
    }

    return viajeEliminado;
  }

  async buscar(
    filtros: BuscarViajeDto,
    queryPaginacionDto: QueryPaginacionDto,
  ): Promise<{
    data: Viaje[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10 } = queryPaginacionDto;
    const skip = (page - 1) * limit;

    const {
      fecha_inicio,
      fecha_llegada,
      _id,
      empresa,
      chofer,
      vehiculo,
      tipo,
      origen,
      destino,
    } = filtros;
    const query: RootFilterQuery<BuscarViajeDto> = { deletedAt: null };

    if (fecha_inicio) {
      const fechaInicio = new Date(fecha_inicio);
      fechaInicio.setHours(0, 0, 0, 0);
      query.fecha_inicio = { $gte: fechaInicio };
    }

    if (fecha_llegada) {
      const fechaLlegada = new Date(fecha_llegada);
      fechaLlegada.setHours(23, 59, 59, 999);
      query.fecha_llegada = { $lte: fechaLlegada };
    }

    // Búsqueda parcial en _id (cualquier substring del hex)
    if (_id) {
      query.$expr = {
        $regexMatch: {
          input: { $toString: '$_id' },
          regex: _id,
          options: 'i',
        },
      };
    }

    if (_id) {
      // Si también quieres filtrar por exact match cuando viene ObjectId
      if (Types.ObjectId.isValid(_id)) {
        query._id = new Types.ObjectId(_id);
      }
    }

    if (empresa) {
      if (Types.ObjectId.isValid(empresa)) {
        query.empresa = new Types.ObjectId(empresa);
      } else {
        const empresaDoc = await this.empresaModel.findOne({
          $or: [
            { razon_social: { $regex: empresa, $options: 'i' } },
            { nombre_comercial: { $regex: empresa, $options: 'i' } },
          ],
          deletedAt: null,
        });
        if (!empresaDoc) return { data: [], total: 0, page, limit };
        query.empresa = empresaDoc._id;
      }
    }

    if (chofer) {
      if (Types.ObjectId.isValid(chofer)) {
        query.chofer = new Types.ObjectId(chofer);
      } else {
        const choferDoc = await this.choferModel.findOne({
          nombre: { $regex: chofer, $options: 'i' },
          deletedAt: null,
        });
        if (!choferDoc) return { data: [], total: 0, page, limit };
        query.chofer = choferDoc._id;
      }
    }

    if (vehiculo) {
      if (Types.ObjectId.isValid(vehiculo)) {
        query.vehiculo = new Types.ObjectId(vehiculo);
      } else {
        const vehiculoDoc = await this.vehiculoModel.findOne({
          patente: { $regex: vehiculo, $options: 'i' },
          deletedAt: null,
        });
        if (!vehiculoDoc) return { data: [], total: 0, page, limit };
        query.vehiculo = vehiculoDoc._id;
      }
    }

    if (tipo) {
      query.tipo_viaje = tipo;
    }

    if (origen) {
      if (Types.ObjectId.isValid(origen)) {
        query.deposito_origen = new Types.ObjectId(origen);
      } else {
        return { data: [], total: 0, page, limit };
      }
    }

    if (destino) {
      if (Types.ObjectId.isValid(destino)) {
        query.deposito_destino = new Types.ObjectId(destino);
      } else {
        return { data: [], total: 0, page, limit };
      }
    }

    const [data, total] = await Promise.all([
      this.viajeModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .populate('deposito_origen')
        .populate('deposito_destino')
        .populate('empresa')
        .populate('chofer')
        .populate('vehiculo')
        .exec(),
      this.viajeModel.countDocuments(query),
    ]);

    return { data, total, page, limit };
  }

  async getDashboard(): Promise<DashboardResponseDto> {
    const hoy = startOfDay(new Date());
    const sieteDiasAtras = new Date();
    sieteDiasAtras.setDate(sieteDiasAtras.getDate() - 7);

    // Generar ObjectId mínimo para los últimos 7 días
    const objectIdMinimo = new ObjectId(Math.floor(Date.now() / 1000 - 604800));

    const [
      viajes,
      totalVehiculos,
      totalChoferes,
      totalEmpresas,
      topEmpresas,
      vehiculosRecientes,
      choferesRecientes,
      empresasRecientes,
    ] = await Promise.all([
      // Próximos viajes
      this.viajeModel
        .find({
          fecha_inicio: { $gte: hoy },
          deletedAt: null,
        })
        .sort({ fecha_inicio: 1 })
        .limit(5)
        .populate('deposito_origen')
        .populate('deposito_destino')
        .populate('empresa')
        .populate('chofer')
        .populate('vehiculo')
        .lean()
        .exec(),

      // Totales
      this.vehiculoModel.countDocuments({ deletedAt: null }),
      this.choferModel.countDocuments({ deletedAt: null }),
      this.empresaModel.countDocuments({ deletedAt: null }),

      // Top empresas con más viajes
      this.viajeModel
        .aggregate([
          { $match: { deletedAt: null } },
          { $group: { _id: '$empresa', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 5 },
          {
            $lookup: {
              from: 'empresa',
              localField: '_id',
              foreignField: '_id',
              as: 'empresaData',
            },
          },
          { $unwind: '$empresaData' },
          {
            $project: {
              empresaId: '$_id',
              nombre: '$empresaData.nombre_comercial',
              cantidadViajes: '$count',
              _id: 0,
            },
          },
        ])
        .exec(),

      // Registros recientes (últimos 7 días)
      this.vehiculoModel.countDocuments({ _id: { $gte: objectIdMinimo } }),
      this.choferModel.countDocuments({ _id: { $gte: objectIdMinimo } }),
      this.empresaModel.countDocuments({ _id: { $gte: objectIdMinimo } }),
    ]);

    return {
      proximosViajes: plainToInstance(ViajeDto, viajes),
      totalVehiculos,
      totalChoferes,
      totalEmpresas,
      topEmpresas: topEmpresas || [],
      estadisticasRecientes: {
        vehiculos: vehiculosRecientes,
        choferes: choferesRecientes,
        empresas: empresasRecientes,
        desde: sieteDiasAtras,
      },
    };
  }
}
