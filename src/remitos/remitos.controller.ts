import {
  Controller,
  Get,
  Param,
  Put,
  Query,
  Body,
  UploadedFile,
  UseInterceptors,
  Post,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { RemitosService } from './remitos.service';
import { RemitoDto, RemitoResponseDto } from './dto/remito.dto';

@Controller('remito')
export class RemitosController {
  constructor(private readonly remitosService: RemitosService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener remitos con filtros y paginación' })
  @ApiResponse({
    status: 200,
    description: 'Lista de remitos obtenida correctamente',
    type: RemitoResponseDto,
  })
  @ApiResponse({ status: 404, description: 'No se encontraron remitos' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Página actual (por defecto 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Cantidad de items por página (por defecto 20)',
  })
  @ApiQuery({
    name: 'numeroAsignado',
    required: false,
    type: String,
    description: 'Filtra por número asignado parcial',
  })
  @ApiQuery({
    name: 'clienteId',
    required: false,
    type: Number,
    description: 'Filtra por cliente',
  })
  @ApiQuery({
    name: 'destinoId',
    required: false,
    type: Number,
    description: 'Filtra por destino',
  })
  @ApiQuery({
    name: 'estadoId',
    required: false,
    type: Number,
    description: 'Filtra por estado',
  })
  @ApiQuery({
    name: 'prioridad',
    required: false,
    type: String,
    description: 'Filtra por prioridad',
  })
  @ApiQuery({
    name: 'fechaEmision',
    required: false,
    type: String,
    description: 'Filtra por fecha de emisión (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'pais',
    required: false,
    type: String,
    description: 'Filtra por país del destino',
  })
  @ApiQuery({
    name: 'provincia',
    required: false,
    type: String,
    description: 'Filtra por provincia del destino',
  })
  @ApiQuery({
    name: 'localidad',
    required: false,
    type: String,
    description: 'Filtra por localidad del destino',
  })
  async getRemitos(
    @Query() query: Record<string, any>,
  ): Promise<RemitoResponseDto> {
    return this.remitosService.getRemitos(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener remito por ID' })
  @ApiResponse({
    status: 200,
    description: 'Remito obtenido correctamente',
    type: RemitoDto,
  })
  @ApiResponse({ status: 404, description: 'Remito no encontrado' })
  async getRemito(@Param('id') id: number): Promise<RemitoDto> {
    return this.remitosService.getRemitoById(id);
  }

  @Put(':id/estado/:eid')
  @ApiOperation({ summary: 'Cambiar estado de remito' })
  @ApiResponse({
    status: 200,
    description: 'Estado del remito actualizado correctamente',
    type: RemitoDto,
  })
  @ApiResponse({ status: 404, description: 'Remito o estado no encontrado' })
  async cambiarEstado(
    @Param('id') id: number,
    @Param('eid') eid: number,
  ): Promise<RemitoDto> {
    return this.remitosService.cambiarEstado(id, eid);
  }

  @Put(':id/firmar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Entregar remito (archivo o base64)' })
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiBody({
    description: 'Archivo firmado del remito (puede ser binario o base64)',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          oneOf: [
            {
              type: 'string',
              format: 'binary',
              description: 'Archivo PDF o imagen (binario)',
            },
            { type: 'string', description: 'Archivo codificado en base64' },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Remito entregado correctamente',
    type: RemitoDto,
  })
  @ApiResponse({ status: 400, description: 'Archivo inválido' })
  @ApiResponse({ status: 404, description: 'Remito no encontrado' })
  async entregarRemito(
    @Param('id') id: number,
    @UploadedFile() file?: Express.Multer.File,
    @Body('file') base64?: string,
  ): Promise<RemitoDto> {
    const input = file ?? base64;
    if (!input) {
      throw new BadRequestException('Debe proporcionar un archivo o un base64');
    }

    return this.remitosService.entregarRemito(id, input);
  }

  @Put(':id/no-entregado')
  @ApiOperation({ summary: 'Marcar remito como no entregado' })
  @ApiResponse({
    status: 200,
    description: 'Remito marcado como no entregado correctamente',
    type: RemitoDto,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        razonNoEntrega: { type: 'string' },
      },
      required: ['razonNoEntrega'],
    },
  })
  @ApiResponse({ status: 404, description: 'Remito no encontrado' })
  async marcarNoEntregado(
    @Param('id') id: number,
    @Body('razonNoEntrega') razon: string,
  ): Promise<RemitoDto> {
    return this.remitosService.marcarNoEntregado(id, razon);
  }

  @Post('by-id')
  @ApiOperation({ summary: 'Obtener remitos por lista de IDs' })
  @ApiResponse({
    status: 200,
    description: 'Lista de remitos obtenida correctamente',
    type: [RemitoDto],
  })
  @ApiResponse({ status: 400, description: 'Body inválido' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ids: { type: 'array', items: { type: 'number' } },
      },
    },
  })
  async getRemitosByIds(@Body('ids') ids: number[]): Promise<RemitoDto[]> {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new BadRequestException('Debe enviar un array de IDs válido');
    }

    return this.remitosService.getRemitosByIds(ids);
  }
}
