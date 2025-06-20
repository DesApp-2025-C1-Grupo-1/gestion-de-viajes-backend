import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TestSetup } from '../test-setup';
import { describe, it, expect, beforeAll } from 'vitest';

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

describe('DepositoController (e2e)', () => {
  let app: INestApplication;
  let depositoId: string;

  const createDepositoDto = {
    nombre: 'deposito',
    lat: 0,
    long: 0,
    tipo: 'propio',
    horario_entrada: '12',
    horario_salida: '12',
    restricciones: 'test',
    direccion: {},
    contacto: {},
  };

  const updateDepositoDto = {
    nombre: 'Deposito Central Actualizado',
  };

  beforeAll(async () => {
    app = await TestSetup.createTestApp();

    createDepositoDto.direccion = {
      calle: 'Calle Falsa',
      numero: '123',
      ciudad: 'Ciudad',
      estado_provincia: 'Provincia',
      pais: '12345',
      tipo: 'deposito',
    };

    createDepositoDto.contacto = {
      nombre: 'Contacto Test',
      email: 'test@test.com',
      telefono: {
        codigo_pais: '54',
        codigo_area: '11',
        numero: '123456789',
      },
    };
    const depositoRes = await request(app.getHttpServer())
      .post('/deposito')
      .send(createDepositoDto);

    depositoId = (depositoRes.body as { _id: string })._id;
  });

  it('/deposito (POST) - should create a new deposito', async () => {
    const response = await request(app.getHttpServer())
      .post('/deposito')
      .send({
        ...createDepositoDto,
        lat: 12,
        long: 34,
        nombre: 'Deposito Secundario',
      });
    expect(response.body).toHaveProperty('_id');
    expect(response.body.nombre).toBe('Deposito Secundario');
  });

  it('/deposito (GET) - should return all depositos', async () => {
    const response = await request(app.getHttpServer())
      .get('/deposito')
      .expect(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/deposito/:id (GET) - should return a specific deposito', async () => {
    const response = await request(app.getHttpServer())
      .get(`/deposito/${depositoId}`)
      .expect(200);

    expect(response.body._id).toBe(depositoId);
    expect(response.body.nombre).toBe(createDepositoDto.nombre);
  });

  it('/deposito/:id (PATCH) - should update a deposito', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/deposito/${depositoId}`)
      .send(updateDepositoDto)
      .expect(200);
    expect(response.body._id).toBe(depositoId);
    expect(response.body.nombre).toBe(updateDepositoDto.nombre);
  });

  it('/deposito/:id (DELETE) - should delete a deposito', async () => {
    await request(app.getHttpServer())
      .delete(`/deposito/${depositoId}`)
      .expect(200);
  });

  it('/deposito/:id (GET) - should return 404 after deletion', async () => {
    await request(app.getHttpServer())
      .get(`/deposito/${depositoId}`)
      .expect(404);
  });
});
