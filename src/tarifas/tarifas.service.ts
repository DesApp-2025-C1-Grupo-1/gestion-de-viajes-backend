import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { TarifaDto } from './dto/tarifa.dto';
import { ZonaDto } from './dto/zona.dto';

@Injectable()
export class TarifasService {
  private readonly baseUrl =
    'https://tarifas-de-costos-acme-backend.onrender.com/api';

  // Listar todas las zonas (provincias)
  async obtenerZonas(): Promise<ZonaDto[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/zonas`);
      return response.data as ZonaDto[]; // [{id:1,nombre:"Buenos Aires"},...]
    } catch {
      throw new HttpException(
        'Error al obtener zonas desde la API externa',
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
        'Error al obtener tarifas desde la API externa',
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
        'Error al obtener tarifas desde la API externa',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
