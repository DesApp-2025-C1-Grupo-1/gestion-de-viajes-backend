import { ApiProperty } from '@nestjs/swagger';

export class DestinoDto {
  @ApiProperty({ example: 52, description: 'ID del destino' })
  id: number;

  @ApiProperty({
    example: 'Centro de Distribución Oeste',
    description: 'Nombre del destino',
  })
  nombre: string;

  @ApiProperty({ example: 'Argentina', description: 'País del destino' })
  pais: string;

  @ApiProperty({
    example: 'Buenos Aires',
    description: 'Provincia del destino',
  })
  provincia: string;

  @ApiProperty({
    example: 'Mar del Plata',
    description: 'Localidad del destino',
  })
  localidad: string;

  @ApiProperty({
    example: 'Av. Constitución 3000, Mar del Plata',
    description: 'Dirección completa del destino',
  })
  direccion: string;

  @ApiProperty({
    example: true,
    description: 'Indica si el destino está activo',
  })
  activo: boolean;

  @ApiProperty({
    example: '2025-09-12T23:35:54.087Z',
    description: 'Fecha de creación del registro',
  })
  createdAt: string;

  @ApiProperty({
    example: '2025-09-12T23:35:54.087Z',
    description: 'Fecha de última actualización del registro',
  })
  updatedAt: string;
}

export class ClienteDto {
  @ApiProperty({ example: 38, description: 'ID del cliente' })
  id: number;

  @ApiProperty({
    example: 'Distribuidora Nacional',
    description: 'Razón social del cliente',
  })
  razonSocial: string;

  @ApiProperty({ example: '20414636080', description: 'CUIT/RUT del cliente' })
  cuit_rut: string;

  @ApiProperty({
    example: 'Av. Rivadavia 2345, CABA',
    description: 'Dirección del cliente',
  })
  direccion: string;

  @ApiProperty({ example: 2, description: 'ID del tipo de empresa' })
  tipoEmpresaId: number;

  @ApiProperty({
    example: true,
    description: 'Indica si el cliente está activo',
  })
  activo: boolean;

  @ApiProperty({
    example: '2025-09-12T23:35:42.791Z',
    description: 'Fecha de creación del registro',
  })
  createdAt: string;

  @ApiProperty({
    example: '2025-09-12T23:35:42.791Z',
    description: 'Fecha de última actualización del registro',
  })
  updatedAt: string;
}

export class EstadoDto {
  @ApiProperty({ example: 1, description: 'ID del estado' })
  id: number;

  @ApiProperty({ example: 'Autorizado', description: 'Nombre del estado' })
  nombre: string;

  @ApiProperty({
    example: '2025-08-30T19:25:28.701Z',
    description: 'Fecha de creación del estado',
  })
  createdAt: string;

  @ApiProperty({
    example: '2025-08-30T19:25:28.701Z',
    description: 'Fecha de última actualización del estado',
  })
  updatedAt: string;
}

export class MercaderiaDto {
  @ApiProperty({ example: 31, description: 'ID de la mercadería' })
  id: number;

  @ApiProperty({ example: 2, description: 'ID del tipo de mercadería' })
  tipoMercaderiaId: number;

  @ApiProperty({
    example: '65005',
    description: 'Valor declarado de la mercadería',
  })
  valorDeclarado: string;

  @ApiProperty({
    example: '31',
    description: 'Volumen en metros cúbicos de la mercadería',
  })
  volumenMetrosCubico: string;

  @ApiProperty({ example: '20001', description: 'Peso de la mercadería' })
  pesoMercaderia: string;

  @ApiProperty({
    example: null,
    description: 'Cantidad de bobinas',
    required: false,
  })
  cantidadBobinas?: number | null;

  @ApiProperty({
    example: null,
    description: 'Cantidad de racks',
    required: false,
  })
  cantidadRacks?: number | null;

  @ApiProperty({
    example: null,
    description: 'Cantidad de bultos',
    required: false,
  })
  cantidadBultos?: number | null;

  @ApiProperty({
    example: null,
    description: 'Cantidad de pallets',
    required: false,
  })
  cantidadPallets?: number | null;

  @ApiProperty({
    example: null,
    description: 'Requisitos especiales',
    required: false,
  })
  requisitosEspeciales?: string | null;

  @ApiProperty({
    example: true,
    description: 'Indica si la mercadería está activa',
  })
  activo: boolean;

  @ApiProperty({
    example: null,
    description: 'ID del estado de la mercadería',
    required: false,
  })
  estadoId?: number | null;

  @ApiProperty({
    example: 32,
    description: 'ID del remito al que pertenece la mercadería',
  })
  remitoId: number;

  @ApiProperty({
    example: '2025-09-13T00:42:16.650Z',
    description: 'Fecha de creación del registro',
  })
  createdAt: string;

  @ApiProperty({
    example: '2025-09-13T00:42:16.650Z',
    description: 'Fecha de última actualización del registro',
  })
  updatedAt: string;
}

export class RemitoDto {
  @ApiProperty({ example: 32, description: 'ID del remito' })
  id: number;

  @ApiProperty({
    example: '1-prueba',
    description: 'Número asignado al remito',
  })
  numeroAsignado: string;

  @ApiProperty({
    example: '2025-09-13T00:42:16.461Z',
    description: 'Fecha de emisión del remito',
  })
  fechaEmision: string;

  @ApiProperty({
    example: '',
    description: 'Observaciones del remito',
    required: false,
  })
  observaciones?: string | null;

  @ApiProperty({
    example: null,
    description: 'Archivo adjunto del remito',
    required: false,
  })
  archivoAdjunto?: string | null;

  @ApiProperty({
    example: null,
    description: 'Razón de no entrega',
    required: false,
  })
  razonNoEntrega?: string | null;

  @ApiProperty({
    example: 'alta',
    description: 'Prioridad del remito',
    enum: ['alta', 'media', 'baja'],
  })
  prioridad: string;

  @ApiProperty({
    example: true,
    description: 'Indica si el remito está activo',
  })
  activo: boolean;

  @ApiProperty({
    example: null,
    description: 'Fecha agendada para el remito',
    required: false,
  })
  fechaAgenda?: string | null;

  @ApiProperty({
    example: null,
    description: 'Archivo del remito firmado',
    required: false,
  })
  remitoFirmado?: string | null;

  @ApiProperty({ example: 38, description: 'ID del cliente' })
  clienteId: number;

  @ApiProperty({ example: 52, description: 'ID del destino' })
  destinoId: number;

  @ApiProperty({ example: 1, description: 'ID del estado actual del remito' })
  estadoId: number;

  @ApiProperty({
    example: null,
    description: 'ID del estado anterior del remito',
    required: false,
  })
  estadoAnteriorId?: number | null;

  @ApiProperty({
    example: '2025-09-13T00:42:16.462Z',
    description: 'Fecha de creación del remito',
  })
  createdAt: string;

  @ApiProperty({
    example: '2025-09-13T00:42:16.462Z',
    description: 'Fecha de última actualización del remito',
  })
  updatedAt: string;

  @ApiProperty({
    type: DestinoDto,
    description: 'Destino asociado al remito',
    required: false,
  })
  destino?: DestinoDto;

  @ApiProperty({
    type: ClienteDto,
    description: 'Cliente asociado al remito',
    required: false,
  })
  cliente?: ClienteDto;

  @ApiProperty({
    type: EstadoDto,
    description: 'Estado actual del remito',
    required: false,
  })
  estado?: EstadoDto;

  @ApiProperty({
    type: [MercaderiaDto],
    description: 'Lista de mercaderías asociadas al remito',
    required: false,
  })
  mercaderias?: MercaderiaDto[];
}
