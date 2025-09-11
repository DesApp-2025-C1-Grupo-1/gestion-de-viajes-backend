import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TarifaService {
  constructor(private readonly httpService: HttpService) {}

  async obtenerTarifas(): Promise<any> {
    const url = 'https://API-EXTERNA-AQUI'; // reemplazar con la URL real

    // Si la API necesita headers o token, agregalos aquí
    const headers = {
      // 'Authorization': 'Bearer TU_TOKEN',
    };

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, { headers })
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener tarifas:', error.message);
      throw new Error('No se pudo obtener tarifas');
    }
  }
}