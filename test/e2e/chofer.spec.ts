/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TestSetup } from '../test-setup';
import { CreateChoferDto } from '../../src/chofer/dto/create-chofer.dto';
import { UpdateChoferDto } from '../../src/chofer/dto/update-chofer.dto';
import { describe, it, expect, beforeAll } from 'vitest';

describe('ChoferController (e2e)', () => {
  let app: INestApplication;
  let empresaId: string;
  let vehiculoId: string;
  let createChoferDto: CreateChoferDto;
  let updateChoferDto: UpdateChoferDto;
  let choferId: string;

  beforeAll(async () => {
    app = await TestSetup.createTestApp();

    const tipoVehiculoRes = await request(app.getHttpServer())
      .post('/tipo-vehiculo')
      .send({ nombre: 'auto', descripcion: 'Vehículo de pasajeros' });
    const empresaRes = await request(app.getHttpServer())
      .post('/empresa')
      .send({
        razon_social: 'Transporte S.A.',
        nombre_comercial: 'Transporte Rápido',
        cuit: '30712345678',
        direccion: {
          calle: 'Calle Falsa',
          numero: '123',
          ciudad: 'Ciudad Test',
          estado_provincia: 'Buenos Aires',
          pais: 'Argentina',
          tipo: 'fiscal',
        },
        contacto: {
          nombre: 'Juan Perez',
          email: 'contacto@transporte.com',
          telefono: {
            codigo_pais: '54',
            codigo_area: '11',
            numero: '123456789',
          },
        },
      });
    empresaId = (empresaRes.body as { _id: string })._id;

    const vehiculoRes = await request(app.getHttpServer())
      .post('/vehiculo')
      .send({
        patente: 'ABC123',
        marca: 'TestMarca',
        modelo: 'TestModelo',
        año: 2020,
        volumen_carga: 4,
        peso_carga: 1000,
        tipo: (tipoVehiculoRes.body as { _id: string })._id,
        empresa: empresaId,
      });
    vehiculoId = (vehiculoRes.body as { _id: string })._id;

    createChoferDto = {
      nombre: 'Test Chofer',
      apellido: 'Test Apellido',
      dni: 12345678,
      licencia: 'A123456',
      fecha_nacimiento: new Date('2025-12-31'),
      tipo_licencia: 'test',
      email: 'test@some.com',
      empresa: empresaId,
      telefono: {
        codigo_pais: '54',
        codigo_area: '11',
        numero: '123456789',
      },
      vehiculo: vehiculoId,
    };

    updateChoferDto = {
      nombre: 'Test Chofer Actualizado',
      apellido: 'Test Apellido Actualizado',
    };

    const response = await request(app.getHttpServer())
      .post('/chofer')
      .send(createChoferDto);
    choferId = (response.body as { _id: string })._id;
  });

  it('/chofer (POST) - should create a new chofer', async () => {
    const response = await request(app.getHttpServer())
      .post('/chofer')
      .send({ ...createChoferDto, dni: 87654321 });
    console.log(response.body);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.nombre).toBe(createChoferDto.nombre);
    expect(response.body.apellido).toBe(createChoferDto.apellido);
    expect(response.body.dni).toBe(87654321);
    expect(response.body.licencia).toBe(createChoferDto.licencia);
  });

  it('/chofer (GET) - should return all choferes', async () => {
    const response = await request(app.getHttpServer())
      .get('/chofer')
      .expect(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/chofer/:id (GET) - should return a specific chofer', async () => {
    const response = await request(app.getHttpServer())
      .get(`/chofer/${choferId}`)
      .expect(200);

    expect(response.body._id).toBe(choferId);
    expect(response.body.nombre).toBe(createChoferDto.nombre);
    expect(response.body.apellido).toBe(createChoferDto.apellido);
  });

  it('/chofer/:id (PATCH) - should update a chofer', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/chofer/${choferId}`)
      .send(updateChoferDto)
      .expect(200);

    expect(response.body._id).toBe(choferId);
    expect(response.body.nombre).toBe(updateChoferDto.nombre);
    expect(response.body.apellido).toBe(updateChoferDto.apellido);
  });

  it('/chofer/:id (DELETE) - should delete a chofer', async () => {
    await request(app.getHttpServer())
      .delete(`/chofer/${choferId}`)
      .expect(200);
  });

  it('/chofer/:id (GET) - should return 404 after deletion', async () => {
    await request(app.getHttpServer()).get(`/chofer/${choferId}`).expect(404);
  });
});
