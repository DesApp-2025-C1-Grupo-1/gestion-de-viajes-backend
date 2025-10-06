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
    const createdViajeDistribucion = new this.viajeDistribucionModel({
      ...createViajeDistribucionDto,
      deletedAt: null,
    });

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
      .findOne({ id, deletedAt: null })
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
      // Si el update incluye cambio de estado, derivamos a updateEstado
      if (updateViajeDistribucionDto.estado) {
        return await this.updateEstado(
          id,
          updateViajeDistribucionDto.estado,
          updateViajeDistribucionDto.kilometros,
        );
      }

      // Construyo el objeto de campos permitidos, convirtiendo a ObjectId
      const camposPermitidos: Partial<UpdateViajeDistribucionDto> = {};

      if (updateViajeDistribucionDto.chofer) {
        camposPermitidos.chofer = String(updateViajeDistribucionDto.chofer);
      }
      if (updateViajeDistribucionDto.vehiculo) {
        camposPermitidos.vehiculo = String(updateViajeDistribucionDto.vehiculo);
      }
      if (updateViajeDistribucionDto.transportista) {
        camposPermitidos.transportista = String(
          updateViajeDistribucionDto.transportista,
        );
      }
      if (updateViajeDistribucionDto.origen) {
        camposPermitidos.origen = String(updateViajeDistribucionDto.origen);
      }

      const updatedViajeDistribucion = await this.viajeDistribucionModel
        .findOneAndUpdate(
          { id, deletedAt: null },
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
        // Re-lanzamos tal cual
        throw err;
      }

      if (err instanceof Error) {
        // Cualquier otro error controlado
        throw new BadRequestException(err.message);
      }

      // Error no esperado (ej: un número, objeto raro, etc.)
      throw new BadRequestException('Error inesperado al actualizar el viaje');
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.viajeDistribucionModel
      .findOneAndUpdate(
        { id, deletedAt: null },
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
        `Estado inválido: ${nuevoEstado}. Permitidos: ${estadosValidos.join(', ')}`,
      );
    }

    const viaje = await this.viajeDistribucionModel
      .findOne({ id, deletedAt: null })
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

    if (nuevoEstado === 'inicio de carga') {
      await this.actualizarEstadosRemitos(
        viaje.remito_ids,
        this.mapEstadoRemito('inicio de carga'),
      );
      viaje.estado = nuevoEstado;
    } else if (nuevoEstado === 'fin de carga') {
      await this.actualizarEstadosRemitos(
        viaje.remito_ids,
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
