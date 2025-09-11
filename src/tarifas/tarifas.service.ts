import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TarifasService {
  private readonly baseUrl = 'https://tarifas-de-costos-acme-backend.onrender.com/api';

  // Listar todas las zonas (provincias)
  async obtenerZonas(): Promise<any[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/zonas`);
      return response.data; // [{id:1,nombre:"Buenos Aires"},...]
    } catch (error) {
      throw new HttpException(
        'Error al obtener zonas desde la API externa',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  // Obtener tarifas filtradas por tipoVehiculo, zona y transportista
  async obtenerTarifasFiltradas(tipoVehiculo: number, zona: number, transportista: number): Promise<any[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/tarifas`, {
        params: { tipoVehiculo, zona, transportista },
      });
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Error al obtener tarifas desde la API externa',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}