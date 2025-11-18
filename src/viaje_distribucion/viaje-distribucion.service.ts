import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery, Types } from 'mongoose';
import { CreateViajeDistribucionDto } from './dto/create-viaje-distribucion.dto';
import { UpdateViajeDistribucionDto } from './dto/update-viaje-distribucion.dto';
import {
  ViajeDistribucion,
  ViajeDistribucionDocument,
} from './schemas/viaje-distribucion.schema';
import { RemitosService } from 'src/remitos/remitos.service';
import {
  TipoVehiculo,
  TipoVehiculoDocument,
} from 'src/tipo_vehiculo/schemas/tipo_vehiculo.schema';
import {
  Deposito,
  DepositoDocument,
} from 'src/deposito/schemas/deposito.schema';
import { Empresa, EmpresaDocument } from 'src/empresa/schemas/empresa.schema';
import {
  Vehiculo,
  VehiculoDocument,
} from 'src/vehiculo/schemas/vehiculo.schema';
import { Chofer, ChoferDocument } from 'src/chofer/schemas/chofer.schema';
import { validateLicenseCompatibility } from 'src/common/function/licencias';
import { QueryPaginacionDto } from 'src/common/dto/query-paginacion.dto';
import { BuscarViajeDistribucionDto } from './dto/buscar-viaje-distribucion.dto';

@Injectable()
export class ViajeDistribucionService {
  constructor(
    @InjectModel(ViajeDistribucion.name)
    private viajeDistribucionModel: Model<ViajeDistribucionDocument>,
    private readonly remitosService: RemitosService,
    @InjectModel(Deposito.name) private depositoModel: Model<DepositoDocument>,
    @InjectModel(Empresa.name) private empresaModel: Model<EmpresaDocument>,
    @InjectModel(Vehiculo.name) private vehiculoModel: Model<VehiculoDocument>,
    @InjectModel(Chofer.name) private choferModel: Model<ChoferDocument>,
    @InjectModel(TipoVehiculo.name)
    private tipoVehiculoModel: Model<TipoVehiculoDocument>,
  ) {}

  async create(
    createViajeDistribucionDto: CreateViajeDistribucionDto,
  ): Promise<ViajeDistribucion> {
    const createdViajeDistribucion = new this.viajeDistribucionModel({
      ...createViajeDistribucionDto,
      deletedAt: null,
    });

    const { fecha_inicio, chofer, vehiculo, transportista } =
      createdViajeDistribucion;

    //Validar que no exista un viaje con los mismos datos
    const viajeExistente = await this.viajeDistribucionModel.findOne({
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
      _id: transportista,
      deletedAt: null,
    });

    if (!vehiculoEncontrado) {
      throw new NotFoundException('El vehículo no existe');
    } else if (!choferEncontrado) {
      throw new NotFoundException('El chofer no existe');
    } else if (!empresaEncontrada) {
      throw new NotFoundException('La empresa no existe');
    }

    if (vehiculoEncontrado.empresa?.toString() !== transportista.toString()) {
      throw new ConflictException(
        'El vehículo no pertenece a la misma empresa que el viaje',
      );
    } else if (
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      choferEncontrado.empresa?.toString() !== transportista.toString()
    ) {
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
      !tipoVehiculoDelVehiculo.licencia_permitida
    ) {
      throw new NotFoundException(
        'El tipo de vehículo asociado al vehículo no tiene licencias permitidas definidas.',
      );
    }

    const esLicenciaCompatible = validateLicenseCompatibility(
      tipoVehiculoDelVehiculo.licencia_permitida,
      choferEncontrado.tipo_licencia,
    );

    if (!esLicenciaCompatible) {
      throw new BadRequestException(
        `La licencia del chofer no es compatible con la licencia requerida por el vehículo.`,
      );
    }

    const saved = await createdViajeDistribucion.save();

    // Al crear el viaje, cambiar los estados de los remitos a "En preparación"
    await this.actualizarEstadosRemitos(
      saved.remito_ids,
      this.mapEstadoRemito('iniciado'),
    );

    return saved;
  }

  async findAll(queryPaginacionDto: QueryPaginacionDto): Promise<{
    data: ViajeDistribucion[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10 } = queryPaginacionDto;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.viajeDistribucionModel
        .find({ deletedAt: null })
        .sort({ fecha_inicio: 1 })
        .skip(skip)
        .limit(limit)
        .populate('origen')
        .populate('chofer')
        .populate('transportista')
        .populate('vehiculo')
        .exec(),
      this.viajeDistribucionModel.countDocuments({ deletedAt: null }),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<ViajeDistribucion> {
    const viajeDistribucion = await this.viajeDistribucionModel
      .findOne({ _id: id, deletedAt: null })
      .populate('origen')
      .populate('chofer')
      .populate('transportista')
      .populate('vehiculo')
      .exec();

    if (!viajeDistribucion) {
      throw new NotFoundException(
        `Viaje de distribución con ID ${id} no encontrado`,
      );
    }

    return viajeDistribucion;
  }

  async findByEstado(estado: string): Promise<ViajeDistribucion[]> {
    return this.viajeDistribucionModel
      .find({ estado, deletedAt: null })
      .populate('origen')
      .populate('chofer')
      .populate('transportista')
      .populate('vehiculo')
      .exec();
  }

  async update(
    id: string,
    updateViajeDistribucionDto: UpdateViajeDistribucionDto,
  ): Promise<ViajeDistribucion> {
    try {
      const viajeActual = await this.viajeDistribucionModel.findById(id).exec();

      if (!viajeActual) {
        throw new NotFoundException(
          `Viaje de distribución con ID ${id} no encontrado`,
        );
      }

      const {
        fecha_inicio = viajeActual.fecha_inicio,
        chofer = viajeActual.chofer,
        vehiculo = viajeActual.vehiculo,
        transportista = viajeActual.transportista,
      } = updateViajeDistribucionDto;

      //Validar que no exista un viaje con los mismos datos
      const viajeExistente = await this.viajeDistribucionModel.findOne({
        _id: { $ne: id },
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
        _id: transportista,
        deletedAt: null,
      });

      if (!vehiculoEncontrado) {
        throw new NotFoundException('El vehículo no existe');
      } else if (!choferEncontrado) {
        throw new NotFoundException('El chofer no existe');
      } else if (!empresaEncontrada) {
        throw new NotFoundException('La empresa no existe');
      }

      if (vehiculoEncontrado.empresa?.toString() !== transportista.toString()) {
        throw new ConflictException(
          'El vehículo no pertenece a la misma empresa que el viaje',
        );
      } else if (
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        choferEncontrado.empresa?.toString() !== transportista.toString()
      ) {
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
        !tipoVehiculoDelVehiculo.licencia_permitida
      ) {
        throw new NotFoundException(
          'El tipo de vehículo asociado al vehículo no tiene licencias permitidas definidas.',
        );
      }

      const esLicenciaCompatible = validateLicenseCompatibility(
        tipoVehiculoDelVehiculo.licencia_permitida,
        choferEncontrado.tipo_licencia,
      );

      if (!esLicenciaCompatible) {
        throw new BadRequestException(
          `La licencia del chofer no es compatible con la licencia requerida por el vehículo.`,
        );
      }

      const estadoCambio =
        updateViajeDistribucionDto.estado !== viajeActual.estado;

      const remitosCambio =
        JSON.stringify(updateViajeDistribucionDto.remito_ids) !==
        JSON.stringify(viajeActual.remito_ids);

      if (estadoCambio || remitosCambio) {
        await this.updateEstado(
          id,
          updateViajeDistribucionDto.estado || viajeActual.estado,
          updateViajeDistribucionDto.kilometros,
          updateViajeDistribucionDto.remito_ids,
        );
      }

      // Resto del código para updates que no incluyen estado ni remitos...
      const camposPermitidos: Partial<UpdateViajeDistribucionDto> = {};

      if (updateViajeDistribucionDto.chofer) {
        camposPermitidos.chofer = new Types.ObjectId(
          updateViajeDistribucionDto.chofer,
        );
      }
      if (updateViajeDistribucionDto.vehiculo) {
        camposPermitidos.vehiculo = new Types.ObjectId(
          updateViajeDistribucionDto.vehiculo,
        );
      }
      if (updateViajeDistribucionDto.transportista) {
        camposPermitidos.transportista = new Types.ObjectId(
          updateViajeDistribucionDto.transportista,
        );
      }
      if (updateViajeDistribucionDto.origen) {
        camposPermitidos.origen = new Types.ObjectId(
          updateViajeDistribucionDto.origen,
        );
      }
      if (updateViajeDistribucionDto.observaciones) {
        camposPermitidos.observaciones = String(
          updateViajeDistribucionDto.observaciones,
        );
      }
      if (updateViajeDistribucionDto.fecha_inicio) {
        camposPermitidos.fecha_inicio = updateViajeDistribucionDto.fecha_inicio;
      }
      if (updateViajeDistribucionDto.kilometros) {
        camposPermitidos.kilometros = updateViajeDistribucionDto.kilometros;
      }

      const updatedViajeDistribucion = await this.viajeDistribucionModel
        .findOneAndUpdate(
          { _id: id, deletedAt: null },
          { $set: camposPermitidos },
          { new: true },
        )
        .populate('origen')
        .populate('chofer')
        .populate('transportista')
        .populate('vehiculo')
        .exec();

      if (!updatedViajeDistribucion) {
        throw new NotFoundException(
          `Viaje de distribución con ID ${id} no encontrado`,
        );
      }

      return updatedViajeDistribucion;
    } catch (err: unknown) {
      if (err instanceof NotFoundException) {
        throw err;
      }

      if (err instanceof Error) {
        throw new BadRequestException(err.message);
      }

      throw new BadRequestException('Error inesperado al actualizar el viaje');
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.viajeDistribucionModel
      .findOneAndUpdate(
        { _id: id, deletedAt: null },
        { deletedAt: new Date() },
        { new: true },
      )
      .exec();

    if (!result) {
      throw new NotFoundException(
        `Viaje de distribución con ID ${id} no encontrado`,
      );
    }

    // Obtener todos los remitos
    const remitos = await Promise.all(
      result.remito_ids.map((rid) => this.remitosService.getRemitoById(rid)),
    );

    // Filtrar los que NO están entregados (estadoId !== 3)
    const remitosNoEntregados = remitos
      .filter((r) => r.estado?.id !== this.mapEstadoRemito('Entregado'))
      .map((r) => r.id);

    if (remitosNoEntregados.length > 0) {
      await this.actualizarEstadosRemitos(
        remitosNoEntregados,
        this.mapEstadoRemito('En preparación'),
      );
    }
  }

  async updateEstado(
    id: string,
    nuevoEstado: string,
    kilometros?: number,
    nuevosRemitos: number[] = [],
  ): Promise<ViajeDistribucion> {
    const estadosValidos = [
      'En preparación',
      'iniciado',
      'inicio de carga',
      'fin de carga',
      'fin de viaje',
    ];
    if (!estadosValidos.includes(nuevoEstado)) {
      throw new BadRequestException(
        `Estado inválido: ${nuevoEstado}. Permitidos: ${estadosValidos.join(', ')}`,
      );
    }

    const viaje = await this.viajeDistribucionModel
      .findOne({ _id: id, deletedAt: null })
      .populate('origen')
      .populate('chofer')
      .populate('transportista')
      .populate('vehiculo')
      .exec();

    if (!viaje) {
      throw new NotFoundException(
        `Viaje de distribución con ID ${id} no encontrado`,
      );
    }

    //convierte remitos eliminados en estado 2 "En preparación"
    for (const rmtViejo of viaje.remito_ids) {
      const remitosEliminados: number[] = [];

      if (!nuevosRemitos.includes(rmtViejo)) {
        remitosEliminados.push(rmtViejo);
      }

      await this.actualizarEstadosRemitos(remitosEliminados, 2);
    }

    viaje.remito_ids = nuevosRemitos;
    const todosRemitos = nuevosRemitos;

    if (nuevoEstado === 'iniciado') {
      await this.actualizarEstadosRemitos(
        todosRemitos,
        this.mapEstadoRemito('iniciado'),
      );
      viaje.estado = nuevoEstado;
    } else if (nuevoEstado === 'inicio de carga') {
      await this.actualizarEstadosRemitos(
        todosRemitos,
        this.mapEstadoRemito('inicio de carga'),
      );
      viaje.estado = nuevoEstado;
    } else if (nuevoEstado === 'fin de carga') {
      await this.actualizarEstadosRemitos(
        todosRemitos,
        this.mapEstadoRemito('fin de carga'),
      );
      viaje.estado = nuevoEstado;
    } else if (nuevoEstado === 'fin de viaje') {
      if (!kilometros || kilometros < 0) {
        throw new BadRequestException(
          'Debe proporcionar un valor válido de kilómetros al finalizar el viaje',
        );
      }

      // Validar que todos los remitos estén en "No entregado" o "Entregado"
      const remitos = await Promise.all(
        todosRemitos.map((rid) => this.remitosService.getRemitoById(rid)),
      );

      const estadosPermitidos = new Set(['No entregado', 'Entregado']);
      const invalidos = remitos.filter(
        (r) => !r.estado?.nombre || !estadosPermitidos.has(r.estado.nombre),
      );

      if (invalidos.length > 0) {
        throw new BadRequestException(
          'No se puede finalizar el viaje: hay remitos que no están en estados "No entregado" o "Entregado"',
        );
      } else {
        viaje.kilometros = Math.max(0, kilometros - (viaje.kilometros ?? 0));
        viaje.estado = nuevoEstado;
      }
    }

    await viaje.save();
    return viaje;
  }

  private mapEstadoRemito(estadoViaje: string): number {
    // 1: Autorizado, 2: En preparación, 3: En carga, 4: En camino, 5: Entregado, 6: No entregado, 7: Retenido
    switch (estadoViaje) {
      case 'En preparación':
        return 2;
      case 'iniciado':
        return 3;
      case 'inicio de carga':
        return 3;
      case 'fin de carga':
        return 4;
      case 'Entregado':
        return 5;
      default:
        return 0;
    }
  }

  private async actualizarEstadosRemitos(
    remitoIds: number[],
    estadoId: number,
  ) {
    if (!estadoId || estadoId === 0) return;
    await Promise.all(
      remitoIds.map((rid) => this.remitosService.cambiarEstado(rid, estadoId)),
    );
  }

  async buscar(
    filtros: BuscarViajeDistribucionDto,
    queryPaginacionDto: QueryPaginacionDto,
  ): Promise<{
    data: ViajeDistribucion[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10 } = queryPaginacionDto;
    const skip = (page - 1) * limit;

    const {
      fecha_desde,
      fecha_hasta,
      _id,
      transportista,
      chofer,
      vehiculo,
      tipo,
      origen,
      remito,
      tarifa,
      estado,
    } = filtros;
    const query: RootFilterQuery<BuscarViajeDistribucionDto> = {
      deletedAt: null,
    };

    if (fecha_desde || fecha_hasta) {
      const rangoFecha: Record<string, Date> = {};
      const offset = 3 * 60; // Argentina UTC-3 en minutos

      if (fecha_desde) {
        const desde = new Date(fecha_desde);
        desde.setHours(0, 0, 0, 0);
        // Ajusta la diferencia horaria
        desde.setMinutes(desde.getMinutes() - offset);
        rangoFecha.$gte = desde;
      }

      if (fecha_hasta) {
        const hasta = new Date(fecha_hasta);
        hasta.setHours(23, 59, 59, 999);
        // Ajusta la diferencia horaria
        hasta.setMinutes(hasta.getMinutes() - offset);
        rangoFecha.$lte = hasta;
      }

      query.fecha_inicio = rangoFecha;
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

    if (transportista) {
      if (Types.ObjectId.isValid(transportista)) {
        const id = new Types.ObjectId(transportista);

        query.$or = [
          { transportista: id },
          { 'transportista._id': id },
          { transportista: transportista },
        ];
      } else {
        const transportistaDoc = await this.empresaModel.findOne({
          $or: [
            { razon_social: { $regex: transportista, $options: 'i' } },
            { nombre_comercial: { $regex: transportista, $options: 'i' } },
          ],
          deletedAt: null,
        });
        if (!transportistaDoc) return { data: [], total: 0, page, limit };
        query.transportista = transportistaDoc._id;
      }
    }

    if (transportista) {
      if (Types.ObjectId.isValid(transportista)) {
        const id = new Types.ObjectId(transportista);

        query.$or = [
          { transportista: id },
          { 'transportista._id': id },
          { transportista: transportista },
        ];
      } else {
        const transportistaDoc = await this.empresaModel.findOne({
          $or: [
            { razon_social: { $regex: transportista, $options: 'i' } },
            { nombre_comercial: { $regex: transportista, $options: 'i' } },
          ],
          deletedAt: null,
        });
        if (!transportistaDoc) return { data: [], total: 0, page, limit };
        query.transportista = transportistaDoc._id;
      }
    }

    if (chofer) {
      if (Types.ObjectId.isValid(chofer)) {
        const id = new Types.ObjectId(chofer);

        query.$or = [{ chofer: id }, { 'chofer._id': id }, { chofer: chofer }];
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
        const id = new Types.ObjectId(vehiculo);

        query.$or = [
          { vehiculo: id },
          { 'vehiculo._id': id },
          { vehiculo: vehiculo },
        ];
      } else {
        const vehiculoDoc = await this.vehiculoModel.findOne({
          patente: { $regex: vehiculo, $options: 'i' },
          deletedAt: null,
        });
        if (!vehiculoDoc) return { data: [], total: 0, page, limit };
        query.vehiculo = vehiculoDoc._id;
      }
    }

    if (origen) {
      if (Types.ObjectId.isValid(origen)) {
        const id = new Types.ObjectId(origen);

        query.$or = [
          { deposito_origen: id },
          { 'deposito_origen._id': id },
          { deposito_origen: origen },
        ];
      } else {
        return { data: [], total: 0, page, limit };
      }
    }

    if (tipo) {
      query.tipo_viaje = tipo;
    }

    if (remito && remito.length > 0) {
      query.remito_ids = { $in: remito };
    }

    if (typeof tarifa === 'number') {
      query.tarifa_id = tarifa;
    }

    if (
      estado === 'iniciado' ||
      estado === 'inicio de carga' ||
      estado === 'fin de carga' ||
      estado === 'fin de viaje'
    ) {
      query.estado = estado;
    }

    const [data, total] = await Promise.all([
      this.viajeDistribucionModel
        .find(query)
        .sort({ fecha_inicio: 1 })
        .skip(skip)
        .limit(limit)
        .populate('origen')
        .populate('transportista')
        .populate('chofer')
        .populate('vehiculo')
        .exec(),
      this.viajeDistribucionModel.countDocuments(query),
    ]);

    return { data, total, page, limit };
  }
}
