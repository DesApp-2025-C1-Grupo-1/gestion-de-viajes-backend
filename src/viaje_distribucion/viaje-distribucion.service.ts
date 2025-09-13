import {
  BadRequestException,
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

@Injectable()
export class ViajeDistribucionService {
  constructor(
    @InjectModel(ViajeDistribucion.name)
    private viajeDistribucionModel: Model<ViajeDistribucionDocument>,
    private readonly remitosService: RemitosService,
  ) {}

  async create(
    createViajeDistribucionDto: CreateViajeDistribucionDto,
  ): Promise<ViajeDistribucion> {
    const createdViajeDistribucion = new this.viajeDistribucionModel(
      createViajeDistribucionDto,
    );
    const saved = await createdViajeDistribucion.save();

    // Al crear el viaje, cambiar los estados de los remitos a "En preparación"
    await this.actualizarEstadosRemitos(
      saved.remito_ids,
      this.mapEstadoRemito('iniciado'),
    );

    return saved;
  }

  async findAll(): Promise<ViajeDistribucion[]> {
    return this.viajeDistribucionModel
      .find({ deletedAt: null })
      .populate('origen')
      .populate('chofer')
      .populate('transportista')
      .populate('vehiculo')
      .exec();
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
  ): Promise<ViajeDistribucion> {
    const estadosValidos = ['iniciado', 'cargando', 'cargado', 'finalizado'];
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

    // Según el cambio de estado del viaje, actualizar estados de remitos
    if (nuevoEstado === 'cargando') {
      // Primero actualizar remitos -> luego persistir estado del viaje
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
    }

    // Persistir el cambio de estado del viaje
    viaje.estado = nuevoEstado;
    await viaje.save();
    return viaje;
  }

  private mapEstadoRemito(estadoViaje: string): number {
    // Mapeo de estados de viaje -> estadoId de remitos backend
    // Suposiciones:
    // 1: Autorizado, 2: En preparación, 3: En carga, 4: En camino, 5: Entregado, 6: No entregado, 7: Retenido
    switch (estadoViaje) {
      case 'iniciado':
        return 2; // En preparación
      case 'cargando':
        return 3; // En carga
      case 'cargado':
        return 4; // En camino
      default:
        return 0; // no aplica
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
