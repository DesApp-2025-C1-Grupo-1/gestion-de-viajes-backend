import { Injectable } from '@nestjs/common';
import { ZonaDto } from './dto/zona.dto';
import { TarifaDto } from './dto/tarifa.dto';

@Injectable()
export class TarifasService {
  private zonas: ZonaDto[] = [
    { id: 1, nombre: 'Ituzaingó' },
    { id: 2, nombre: 'Morón' },
    { id: 3, nombre: 'Merlo' },
  ];

  private tarifas: TarifaDto[] = [
    {
      id: 1,
      nombre: 'Tarifa 2',
      valorBase: 30000,
      esVigente: true,
      transportistaNombre: 'Oca',
      tipoVehiculoNombre: 'Camión',
      zonaNombre: 'Ituzaingó',
      tipoCargaNombre: 'Madera',
      transportistaId: 1,
      tipoVehiculoId: 1,
      zonaId: 1,
      tipoCargaId: 1,
      total: 34000,
      adicionales: [
        {
          id: 1,
          nombre: 'Estadia',
          costoDefault: 4000,
          descripcion: '2 noches',
          activo: true,
          esGlobal: false,
          costoEspecifico: 4000,
        },
      ],
    },
  ];

  async getZonas(): Promise<ZonaDto[]> {
    return this.zonas;
  }

  async getTarifas(
    transportistaId?: number,
    tipoVehiculoId?: number,
  ): Promise<TarifaDto[]> {
    // Filtra por transportista y tipo de vehículo si se pasan parámetros
    return this.tarifas.filter(
      (t) =>
        (!transportistaId || t.transportistaId === transportistaId) &&
        (!tipoVehiculoId || t.tipoVehiculoId === tipoVehiculoId),
    );
  }
}