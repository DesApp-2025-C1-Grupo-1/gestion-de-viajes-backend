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
import { TarifasService } from 'src/tarifas/tarifas.service';
import { RemitosService } from 'src/remitos/remitos.service';
import { ComparativaCostoDto } from 'src/tarifas/dto/comparativaCosto.dto';

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
      const sieteDiasAtras = subDays(hoy, 7);

      const [
        proximosViajes,
        viajesEnCamino,
        viajesRecientes,
        topEmpresas,
        comparativaCostosRaw,
        cantidadTarifas,
      ] = await Promise.all([
        // Próximos viajes
        this.viajeDistribucionModel
          .find({ fecha_inicio: { $gte: hoy }, deletedAt: null })
          .sort({ fecha_inicio: 1 })
          .limit(5)
          .populate(['vehiculo', 'chofer', 'transportista'])
          .lean(),

        // Viajes en camino (solo cantidad)
        this.viajeDistribucionModel.countDocuments({
          estado: 'fin de carga',
          deletedAt: null,
        }),

        // Viajes recientes última semana
        this.viajeDistribucionModel
          .find({ createdAt: { $gte: sieteDiasAtras }, deletedAt: null })
          .populate(['vehiculo', 'chofer', 'transportista'])
          .lean(),

        // Top empresas
        this.viajeDistribucionModel.aggregate([
          { $match: { deletedAt: null, transportista: { $ne: null } } },
          {
            $group: {
              _id: { $toString: '$transportista' },
              cantidadViajes: { $sum: 1 },
            },
          },
          {
            $lookup: {
              from: 'empresa',
              let: { transporteIdStr: '$_id' },
              pipeline: [
                { $addFields: { _idStr: { $toString: '$_id' } } },
                {
                  $match: { $expr: { $eq: ['$_idStr', '$$transporteIdStr'] } },
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

        // Comparativa de costos
        this.tarifasService.obtenerComparativaCostos(),

        // Cantidad total de tarifas
        this.tarifasService.obtenerCantidadTarifas(),
      ]);

      // Transformamos comparativaCostos para que cumpla con el DTO
      const comparativaCostos: ComparativaCostoDto[] = comparativaCostosRaw.map(
        (c) => ({
          nombre: c.nombre,
          average: c.promedio, // mapeamos 'promedio' → 'average'
          max: c.maximo, // mapeamos 'maximo' → 'max'
        }),
      );

      const remitosResponse = await this.remitosService.getRemitos({
        page: 1,
        limit: 300,
      });
      const remitosCount = Array.isArray(remitosResponse.data)
        ? remitosResponse.data.length
        : 0;

      return {
        proximosViajes: plainToInstance(ViajeDistribucionDto, proximosViajes),
        viajesEnCamino,
        viajesRecientes: plainToInstance(ViajeDistribucionDto, viajesRecientes),
        topEmpresas: plainToInstance(EmpresaViajesDistribucionDto, topEmpresas),
        comparativaCostos,
        remitos: remitosCount,
        cantidadTarifas: cantidadTarifas.total,
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
