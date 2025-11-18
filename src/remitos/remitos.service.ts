import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as FormData from 'form-data';
import { AxiosError } from 'axios';
import { RemitoDto, RemitoResponseDto } from './dto/remito.dto';

@Injectable()
export class RemitosService {
  private readonly baseUrl =
    process.env.REMITOS_API_URL || 'http://localhost:3002';

  constructor(private readonly http: HttpService) {}

  async getRemitos(query: Record<string, unknown>): Promise<RemitoResponseDto> {
    const response = await firstValueFrom(
      this.http.get(`${this.baseUrl}/remito`, { params: query }),
    );

    return response.data as RemitoResponseDto;
  }

  async getRemitoById(id: number): Promise<RemitoDto> {
    const response = await firstValueFrom(
      this.http.get(`${this.baseUrl}/remito/${id}`),
    );
    return response.data as RemitoDto;
  }

  async cambiarEstado(id: number, eid: number): Promise<RemitoDto> {
    try {
      const response = await firstValueFrom(
        this.http.put(`${this.baseUrl}/remito/${id}/estado/${eid}`),
      );
      return response.data as RemitoDto;
    } catch (err) {
      const error = err as AxiosError;

      if (error.response) {
        throw new HttpException(
          error.response.data as string | Record<string, any>,
          error.response.status,
        );
      }
      throw new HttpException(
        'Error comunicándose con backend de remitos',
        500,
      );
    }
  }

  async entregarRemito(id: number, input: Express.Multer.File | string) {
    try {
      const formData = new FormData();

      if (typeof input === 'string') {
        formData.append('remitoFirmado', input);
      } else {
        formData.append('remitoFirmado', input.buffer, {
          filename: input.originalname,
          contentType: input.mimetype,
        });
      }

      const response = await firstValueFrom(
        this.http.put(`${this.baseUrl}/remito/${id}/firmar`, formData, {
          headers: formData.getHeaders(),
        }),
      );

      return response.data as RemitoDto;
    } catch (err) {
      const error = err as AxiosError;

      if (error.response) {
        throw new HttpException(
          error.response.data as string | Record<string, any>,
          error.response.status,
        );
      }

      throw new HttpException(
        'Error comunicándose con backend de remitos',
        500,
      );
    }
  }

  async marcarNoEntregado(id: number, razonNoEntrega: string) {
    try {
      const response = await firstValueFrom(
        this.http.put(`${this.baseUrl}/remito/${id}/no-entregado`, {
          razonNoEntrega,
        }),
      );
      return response.data as RemitoDto;
    } catch (err) {
      const error = err as AxiosError;

      if (error.response) {
        console.log(error.response.data);
        throw new HttpException(
          error.response.data as string | Record<string, any>,
          error.response.status,
        );
      }
      throw new HttpException(
        'Error comunicándose con backend de remitos',
        500,
      );
    }
  }

  async getRemitosByIds(ids: number[]): Promise<RemitoDto[]> {
    try {
      const response = await firstValueFrom(
        this.http.post(`${this.baseUrl}/remitos/by-id`, { ids }),
      );

      return response.data.data as RemitoDto[];
    } catch (err) {
      const error = err as AxiosError;

      if (error.response) {
        throw new HttpException(
          error.response.data as string | Record<string, any>,
          error.response.status,
        );
      }
      throw new HttpException(
        'Error comunicándose con backend de remitos',
        500,
      );
    }
  }
}
