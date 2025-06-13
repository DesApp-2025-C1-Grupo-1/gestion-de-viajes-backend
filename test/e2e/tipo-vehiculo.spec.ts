/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TestSetup } from '../test-setup';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { CreateTipoVehiculoDto } from 'src/tipo_vehiculo/dto/create-tipo_vehiculo.dto';
import { UpdateTipoVehiculoDto } from 'src/tipo_vehiculo/dto/update-tipo_vehiculo.dto';

describe('TipoVehiculoController (e2e)', () => {
  let app: INestApplication;
  let tipoVehiculoId: string;
  let createTipoVehiculoDto: CreateTipoVehiculoDto;
  let updateTipoVehiculoDto: UpdateTipoVehiculoDto;

  beforeAll(async () => {
    app = await TestSetup.createTestApp();

    createTipoVehiculoDto = {
      nombre: 'Test Tipo Vehiculo',
      descripcion: 'Descripción de prueba',
    };

    updateTipoVehiculoDto = {
      nombre: 'Test Tipo Vehiculo Actualizado',
      descripcion: 'Descripción actualizada',
    };

    const response = await request(app.getHttpServer())
      .post('/tipo-vehiculo')
      .send(createTipoVehiculoDto);

    tipoVehiculoId = response.body._id;
  });

  afterAll(async () => {
    await TestSetup.closeTestApp(app);
  });

  it('/tipo-vehiculo (POST) - should create a new tipo vehiculo', async () => {
    const response = await request(app.getHttpServer())
      .post('/tipo-vehiculo')
      .send({ ...createTipoVehiculoDto, nombre: 'Test Tipo Vehiculo 2' })
      .expect(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body.nombre).toBe('Test Tipo Vehiculo 2');
    expect(response.body.descripcion).toBe(createTipoVehiculoDto.descripcion);
  });

  it('/tipo-vehiculo (GET) - should return all tipo vehiculos', async () => {
    const response = await request(app.getHttpServer())
      .get('/tipo-vehiculo')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/tipo-vehiculo/:id (GET) - should return a specific tipo vehiculo', async () => {
    const response = await request(app.getHttpServer())
      .get(`/tipo-vehiculo/${tipoVehiculoId}`)
      .expect(200);

    expect(response.body._id).toBe(tipoVehiculoId);
    expect(response.body.nombre).toBe(createTipoVehiculoDto.nombre);
  });

  it('/tipo-vehiculo/:id (PATCH) - should update a tipo vehiculo', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/tipo-vehiculo/${tipoVehiculoId}`)
      .send(updateTipoVehiculoDto)
      .expect(200);

    expect(response.body._id).toBe(tipoVehiculoId);
    expect(response.body.nombre).toBe(updateTipoVehiculoDto.nombre);
    expect(response.body.descripcion).toBe(updateTipoVehiculoDto.descripcion);
  });

  it('/tipo-vehiculo/:id (DELETE) - should delete a tipo vehiculo', async () => {
    await request(app.getHttpServer())
      .delete(`/tipo-vehiculo/${tipoVehiculoId}`)
      .expect(200);
  });

  it('/tipo-vehiculo/:id (GET) - should return 404 after deletion', async () => {
    await request(app.getHttpServer())
      .get(`/tipo-vehiculo/${tipoVehiculoId}`)
      .expect(404);
  });
});
