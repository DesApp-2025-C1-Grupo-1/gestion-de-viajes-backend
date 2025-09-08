import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TarifasService {
  constructor(private readonly httpService: HttpService) {}

  async obtenerTarifas() {
    //  acá va la URL real de la API externa
    const url = 'https://api.ejemplo.com/tarifas';

    try {
      const response = await firstValueFrom(this.httpService.get(url));
      return response.data;
    } catch (error) {
      // Mientras no esté lista la API, devolvemos datos mockeados
      return [
        { id: 1, zona: 'Ituzaingó', valorBase: 30000 },
        { id: 2, zona: 'Morón', valorBase: 45000 },
      ];
    }
  }
}
