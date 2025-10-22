import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ViajeDistribucion,
  ViajeDistribucionDocument,
} from 'src/viaje_distribucion/schemas/viaje-distribucion.schema';
import { Model } from 'mongoose';
import { startOfDay, subDays } from 'date-fns';
import {
  DashboardDistribucionResponseDto,
  EmpresaViajesDistribucionDto,
} from './dto/dashboardDistribucion.dto';
import { plainToInstance } from 'class-transformer';
import { ViajeDistribucionDto } from 'src/viaje_distribucion/dto/viaje-distribucion.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(ViajeDistribucion.name)
    private viajeDistribucionModel: Model<ViajeDistribucionDocument>,
  ) {}

  async getDashboard(): Promise<DashboardDistribucionResponseDto> {
    try {
      const hoy = startOfDay(new Date());
      const sieteDiasAtras = subDays(hoy, 7); // de date-fns

      const [proximosViajes, viajesEnCamino, viajesRecientes, topEmpresas] =
        await Promise.all([
          // --- Próximos viajes (fecha futura)
          this.viajeDistribucionModel
            .find({
              fecha_inicio: { $gte: hoy },
              deletedAt: null,
            })
            .sort({ fecha_inicio: 1 })
            .limit(3)
            .populate(['vehiculo', 'chofer', 'transportista'])
            .lean(),

          // --- Viajes en camino (según estado)
          this.viajeDistribucionModel.countDocuments({
            estado: 'fin de carga',
            deletedAt: null,
          }),

          // --- Viajes recientes en la última semana
          this.viajeDistribucionModel
            .find({
              createdAt: { $gte: sieteDiasAtras },
              deletedAt: null,
            })
            .populate(['vehiculo', 'chofer', 'transportista'])
            .lean(),

          // --- Top empresas con más viajes
          this.viajeDistribucionModel.aggregate([
            {
              $match: {
                deletedAt: null,
                transportista: { $ne: null },
              },
            },
            {
              $group: {
                _id: { $toString: '$transportista' }, // convertir transportista a string
                cantidadViajes: { $sum: 1 },
              },
            },
            {
              $lookup: {
                from: 'empresa',
                let: { transporteIdStr: '$_id' },
                pipeline: [
                  {
                    $addFields: { _idStr: { $toString: '$_id' } }, // convertir ObjectId de empresa a string
                  },
                  {
                    $match: {
                      $expr: { $eq: ['$_idStr', '$$transporteIdStr'] },
                    },
                  },
                ],
                as: 'empresaData',
              },
            },
            { $unwind: '$empresaData' },
            {
              $project: {
                empresaId: '$_id',
                nombre: '$empresaData.nombre_comercial',
                cantidadViajes: 1,
                _id: 0,
              },
            },
            { $sort: { cantidadViajes: -1 } },
            { $limit: 3 },
          ]),
        ]);

      return {
        proximosViajes: plainToInstance(ViajeDistribucionDto, proximosViajes),
        viajesEnCamino,
        viajesRecientes: plainToInstance(ViajeDistribucionDto, viajesRecientes),
        topEmpresas: plainToInstance(EmpresaViajesDistribucionDto, topEmpresas),
      };
    } catch (err) {
      if (err instanceof Error) {
        throw new BadRequestException(
          `Error al obtener dashboard: ${err.message}`,
        );
      }
      throw new BadRequestException('Error desconocido al obtener dashboard');
    }
  }
}
