/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TestSetup } from '../test-setup';
import { CreateVehiculoDto } from '../../src/vehiculo/dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from '../../src/vehiculo/dto/update-vehiculo.dto';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

describe('VehiculoController (e2e)', () => {
  let app: INestApplication;
  let createdVehiculoId: string;
  let tipoVehiculoId: string;
  let empresaId: string;
  let createVehiculoDto: CreateVehiculoDto;
  let updateVehiculoDto: UpdateVehiculoDto;

  beforeAll(async () => {
    app = await TestSetup.createTestApp();

    const tipoVehiculoResponse = await request(app.getHttpServer())
      .post('/tipo-vehiculo')
      .send({
        nombre: 'Test Tipo Vehiculo',
        descripcion: 'Descripción de prueba',
      });
    tipoVehiculoId = tipoVehiculoResponse.body._id;

    const empresaResponse = await request(app.getHttpServer())
      .post('/empresa')
      .send({
        razon_social: 'Test Empresa S.A.',
        nombre_comercial: 'Test Empresa',
        cuit: '12345678901',
        direccion: {
          calle: 'Test Calle',
          numero: '123',
          ciudad: 'Test Ciudad',
          estado_provincia: 'Test Provincia',
          pais: 'Argentina',
          tipo: 'fiscal',
        },
        contacto: {
          nombre: 'Test Contacto',
          email: 'test@test.com',
          telefono: {
            codigo_pais: '54',
            codigo_area: '11',
            numero: '12345678',
          },
        },
      });
    empresaId = empresaResponse.body._id;

    createVehiculoDto = {
      patente: 'ABC123',
      marca: 'Test Marca',
      modelo: 'Test Modelo',
      año: 2020,
      volumen_carga: 15.5,
      peso_carga: 1200,
      tipo: tipoVehiculoId,
      empresa: empresaId,
    };

    updateVehiculoDto = {
      marca: 'Test Marca Actualizada',
      modelo: 'Test Modelo Actualizado',
    };
  });

  afterAll(async () => {
    await TestSetup.closeTestApp(app);
  });

  it('/vehiculo (POST) - should create a new vehiculo', async () => {
    const response = await request(app.getHttpServer())
      .post('/vehiculo')
      .send(createVehiculoDto)
      .expect(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body.patente).toBe(createVehiculoDto.patente);
    expect(response.body.marca).toBe(createVehiculoDto.marca);
    expect(response.body.modelo).toBe(createVehiculoDto.modelo);
    createdVehiculoId = response.body._id;
  });

  it('/vehiculo (GET) - should return all vehiculos', async () => {
    const response = await request(app.getHttpServer())
      .get('/vehiculo')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/vehiculo/:id (GET) - should return a specific vehiculo', async () => {
    const response = await request(app.getHttpServer())
      .get(`/vehiculo/${createdVehiculoId}`)
      .expect(200);

    expect(response.body._id).toBe(createdVehiculoId);
    expect(response.body.patente).toBe(createVehiculoDto.patente);
    expect(response.body.marca).toBe(createVehiculoDto.marca);
  });

  it('/vehiculo/:id (PATCH) - should update a vehiculo', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/vehiculo/${createdVehiculoId}`)
      .send(updateVehiculoDto)
      .expect(200);

    expect(response.body._id).toBe(createdVehiculoId);
    expect(response.body.marca).toBe(updateVehiculoDto.marca);
    expect(response.body.modelo).toBe(updateVehiculoDto.modelo);
  });

  it('/vehiculo/:id (DELETE) - should delete a vehiculo', async () => {
    await request(app.getHttpServer())
      .delete(`/vehiculo/${createdVehiculoId}`)
      .expect(200);
  });

  it('/vehiculo/:id (GET) - should return 404 after deletion', async () => {
    await request(app.getHttpServer())
      .get(`/vehiculo/${createdVehiculoId}`)
      .expect(404);
  });
});
