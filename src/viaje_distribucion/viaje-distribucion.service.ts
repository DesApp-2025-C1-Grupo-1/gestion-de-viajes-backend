import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

    const { origen, fecha_inicio, chofer, vehiculo, transportista } =
      createdViajeDistribucion;

    //Validar que no exista un viaje con los mismos datos
    const viajeExistente = await this.viajeDistribucionModel.findOne({
      origen,
      fecha_inicio,
      chofer,
      deletedAt: null,
    });
    if (viajeExistente) {
      console.log('Viaje existente:', viajeExistente);
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
    const updatedViajeDistribucion = await this.viajeDistribucionModel
      .findOneAndUpdate(
        { _id: id, deletedAt: null },
        updateViajeDistribucionDto,
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
  }

  async updateEstado(
    id: string,
    nuevoEstado: string,
    kilometros?: number,
  ): Promise<ViajeDistribucion> {
    const estadosValidos = [
      'iniciado',
      'inicio de carga',
      'fin de carga',
      'fin de viaje',
    ];
    if (!estadosValidos.includes(nuevoEstado)) {
      throw new BadRequestException(
        `Estado inválido: ${nuevoEstado}. Permitidos: ${estadosValidos.join(
          ', ',
        )}`,
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

    if (nuevoEstado === 'cargando') {
      await this.actualizarEstadosRemitos(
        viaje.remito_ids,
        this.mapEstadoRemito('cargando'),
      );
    } else if (nuevoEstado === 'cargado') {
      await this.actualizarEstadosRemitos(
        viaje.remito_ids,
        this.mapEstadoRemito('cargado'),
      );
    } else if (nuevoEstado === 'finalizado') {
      if (!kilometros || kilometros < 0) {
        throw new BadRequestException(
          'Debe proporcionar un valor válido de kilómetros al finalizar el viaje',
        );
      }

      // Validar que todos los remitos estén en "No entregado" o "Entregado" antes de finalizar viaje
      const remitos = await Promise.all(
        viaje.remito_ids.map((rid) => this.remitosService.getRemitoById(rid)),
      );

      const estadosPermitidos = new Set(['No entregado', 'Entregado']);
      const invalidos = remitos.filter(
        (r) => !r.estado?.nombre || !estadosPermitidos.has(r.estado.nombre),
      );
      if (invalidos.length > 0) {
        throw new BadRequestException(
          'No se puede finalizar el viaje: hay remitos que no están en estados "No entregado" o "Entregado"',
        );
      }
      viaje.kilometros = Math.max(0, kilometros - (viaje.kilometros ?? 0));
    }

    viaje.estado = nuevoEstado;
    await viaje.save();
    return viaje;
  }

  private mapEstadoRemito(estadoViaje: string): number {
    // 1: Autorizado, 2: En preparación, 3: En carga, 4: En camino, 5: Entregado, 6: No entregado, 7: Retenido
    switch (estadoViaje) {
      case 'iniciado':
        return 3;
      case 'inicio de carga':
        return 3;
      case 'fin de carga':
        return 4;
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
}
