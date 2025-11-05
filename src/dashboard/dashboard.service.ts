import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ViajeDistribucion,
  ViajeDistribucionDocument,
} from 'src/viaje_distribucion/schemas/viaje-distribucion.schema';
import { Model, Types } from 'mongoose';
import { startOfDay } from 'date-fns';
import {
  DashboardDistribucionResponseDto,
  ProximoViajeDto,
} from './dto/dashboardDistribucion.dto';
import { TarifasService } from 'src/tarifas/tarifas.service';
import { RemitosService } from 'src/remitos/remitos.service';
import { RemitoDto } from 'src/remitos/dto/remito.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(ViajeDistribucion.name)
    private viajeDistribucionModel: Model<ViajeDistribucionDocument>,
    private tarifasService: TarifasService,
    private remitosService: RemitosService,
  ) {}

  async getDashboard(): Promise<DashboardDistribucionResponseDto> {
    try {
      const hoy = startOfDay(new Date());

      // 1️⃣ Consultas de viajes
      interface EstadoAggregate {
        _id: string;
        cantidad: number;
      }

      const [totalViajes, viajesPorEstadoRaw, proximosViajes] =
        await Promise.all([
          this.viajeDistribucionModel.countDocuments({ deletedAt: null }),
          this.viajeDistribucionModel.aggregate<EstadoAggregate>([
            { $match: { deletedAt: null } },
            { $group: { _id: '$estado', cantidad: { $sum: 1 } } },
          ]),
          this.viajeDistribucionModel
            .find({ fecha_inicio: { $gte: hoy }, deletedAt: null })
            .sort({ fecha_inicio: 1 })
            .limit(3)
            .populate([
              { path: 'transportista', select: 'nombre_comercial' },
              { path: 'chofer', select: 'nombre apellido' },
            ])
            .lean(),
        ]);

      // 2️⃣ Mapear estados de viajes
      const viajesPorEstado = {
        iniciado: 0,
        inicioCarga: 0,
        finCarga: 0,
        finViaje: 0,
      };
      viajesPorEstadoRaw.forEach((v) => {
        switch (v._id) {
          case 'iniciado':
            viajesPorEstado.iniciado = v.cantidad;
            break;
          case 'inicio de carga':
            viajesPorEstado.inicioCarga = v.cantidad;
            break;
          case 'fin de carga':
            viajesPorEstado.finCarga = v.cantidad;
            break;
          case 'fin de viaje':
            viajesPorEstado.finViaje = v.cantidad;
            break;
        }
      });

      // 3️⃣ Obtener remitos
      const remitosResponse = await this.remitosService.getRemitos({
        page: 1,
        limit: 1000,
      });
      const remitos: RemitoDto[] = remitosResponse.data || [];
      const totalRemitos = remitos.length;

      const remitosPorEstado = {
        enCamino: remitos.filter((r) => r.estado?.nombre === 'En camino')
          .length,
        entregados: remitos.filter((r) => r.estado?.nombre === 'Entregado')
          .length,
        noEntregados: remitos.filter((r) => r.estado?.nombre === 'No entregado')
          .length,
      };

      // 4️⃣ Formatear próximos viajes
      const proximosViajesFormateados: ProximoViajeDto[] = proximosViajes.map(
        (viaje) => {
          const remitosAsociados = remitos.filter((r) =>
            viaje.remito_ids.includes(r.id),
          );
          const remitosEntregados = remitosAsociados.filter(
            (r) => r.estado?.nombre === 'Entregado',
          ).length;

          const transportista = viaje.transportista as
            | { nombre_comercial?: string }
            | undefined;
          const chofer = viaje.chofer as
            | { nombre?: string; apellido?: string }
            | undefined;

          // Valor de tarifa: undefined por defecto, luego se puede completar desde otro backend
          const valorTarifa: number | undefined = undefined;

          return {
            _id:
              viaje._id instanceof Types.ObjectId
                ? viaje._id.toHexString()
                : // eslint-disable-next-line @typescript-eslint/no-base-to-string
                  String(viaje._id),
            nro_viaje: viaje.nro_viaje,
            fecha: viaje.fecha_inicio,
            empresa: transportista?.nombre_comercial ?? '-',
            chofer:
              `${chofer?.nombre ?? ''} ${chofer?.apellido ?? ''}`.trim() || '-',
            valorTarifa,
            totalRemitos: remitosAsociados.length,
            remitosEntregados,
          };
        },
      );

      // ✅ Respuesta final
      return {
        totalViajes,
        viajesPorEstado,
        totalRemitos,
        remitosPorEstado,
        proximosViajes: proximosViajesFormateados,
      };
    } catch (err) {
      console.error(err);
      throw new BadRequestException(
        err instanceof Error
          ? `Error al obtener dashboard: ${err.message}`
          : 'Error desconocido al obtener dashboard',
      );
    }
  }
}
