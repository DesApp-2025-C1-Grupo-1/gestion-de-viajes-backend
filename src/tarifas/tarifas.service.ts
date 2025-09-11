import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TarifasService {
  private readonly baseUrl = 'https://tarifas-de-costos-acme-backend.onrender.com';

  async obtenerTarifas(): Promise<any[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/tarifas`);
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Error al obtener tarifas desde la API externa',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}