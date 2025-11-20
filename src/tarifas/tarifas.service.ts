import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { TarifaDto } from './dto/tarifa.dto';
import { ZonaDto } from './dto/zona.dto';
import { ComparativaCostoDto } from './dto/comparativaCosto.dto';

@Injectable()
export class TarifasService {
  private readonly baseUrl =
    process.env.TARIFAS_API_URL || 'http://localhost:7070';

  // Listar todas las zonas (provincias)
  async obtenerZonas(): Promise<ZonaDto[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/zonas`);
      return response.data as ZonaDto[]; // [{id:1,nombre:"Buenos Aires"},...]
    } catch {
      throw new HttpException(
        'Error al obtener zonas desde la API externa obtenerZonas',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  // Obtener tarifas filtradas por tipoVehiculo, zona y transportista
  async obtenerTarifasFiltradas(
    tipoVehiculo: string,
    zona: number,
    transportista: string,
  ): Promise<TarifaDto[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/tarifas`, {
        params: { tipoVehiculo, zona, transportista },
      });
      return response.data as TarifaDto[];
    } catch {
      throw new HttpException(
        'Error al obtener tarifas desde la API externa obtenerTarifasFiltradas',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async obtenerTarifaById(id: number): Promise<TarifaDto> {
    try {
      const response = await axios.get(`${this.baseUrl}/tarifas/${id}`);

      return response.data as TarifaDto;
    } catch {
      throw new HttpException(
        'Error al obtener tarifas desde la API externa obtenerTarifaById',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async obtenerCantidadTarifas(): Promise<{ total: number }> {
    try {
      const response = await axios.get(`${this.baseUrl}/tarifas`);
      const tarifas = response.data as TarifaDto[];
      return { total: tarifas.length };
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new BadRequestException(
          `Error al obtener cantidad de tarifas: ${err.message}`,
        );
      } else {
        throw new BadRequestException(
          'Error desconocido al obtener cantidad de tarifas',
        );
      }
    }
  }

  // 🔹 Nuevo: obtener comparativa de costos por zona
  async obtenerComparativaCostos(): Promise<
    {
      nombre: string;
      promedio: number;
      minimo: number;
      maximo: number;
      tarifas: number;
    }[]
  > {
    try {
      // Llamada al API externo
      const response: AxiosResponse<
        Record<string, ComparativaCostoDto | 'No hay tarifas'>
      > = await axios.get(`${this.baseUrl}/zonas/comparativa-costos`);

      const data = response.data;

      // Transformar la respuesta
      const transformado = Object.entries(data)
        // Filtrar zonas que tengan datos reales
        .filter(([value]) => value !== 'No hay tarifas')
        .map(([nombre, value]) => {
          // Type guard: aseguramos que value sea objeto
          if (typeof value !== 'object' || value === null) return null;
          const zona: ComparativaCostoDto = value;
          // Validar que los campos obligatorios existan
          return {
            nombre,
            promedio: Number(zona.average.toFixed(2)),
            maximo: zona.max,
          };
        })
        .filter(Boolean) // eliminar nulls
        .sort((a, b) => b!.promedio - a!.promedio) // ordenar por promedio descendente
        .slice(0, 5); // top 5 zonas

      return transformado as {
        nombre: string;
        promedio: number;
        minimo: number;
        maximo: number;
        tarifas: number;
      }[];
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new BadRequestException(
          `Error al obtener comparativa de costos de tarifas: ${err.message}`,
        );
      } else {
        throw new BadRequestException(
          'Error desconocido al obtener comparativa de costos de tarifas',
        );
      }
    }
  }

  async obtenerTarifas(): Promise<TarifaDto[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/tarifas`);
      return response.data as TarifaDto[];
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new BadRequestException(
          `Error al obtener tarifas: ${err.message}`,
        );
      } else {
        throw new BadRequestException('Error desconocido al obtener tarifas');
      }
    }
  }
}
