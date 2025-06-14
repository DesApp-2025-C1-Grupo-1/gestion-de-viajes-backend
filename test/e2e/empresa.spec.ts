/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TestSetup } from '../test-setup';
import { CreateEmpresaDto } from '../../src/empresa/dto/create-empresa.dto';
import { UpdateEmpresaDto } from '../../src/empresa/dto/update-empresa.dto';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

describe('EmpresaController (e2e)', () => {
  let app: INestApplication;
  let empresaId: string;
  let createEmpresaDto: CreateEmpresaDto;
  let updateEmpresaDto: UpdateEmpresaDto;

  beforeAll(async () => {
    app = await TestSetup.createTestApp();

    createEmpresaDto = {
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
    };

    updateEmpresaDto = {
      nombre_comercial: 'Test Empresa Actualizada',
      contacto: {
        nombre: 'Test Contacto Actualizado',
        email: 'test.actualizado@test.com',
        telefono: {
          codigo_pais: '54',
          codigo_area: '11',
          numero: '87654321',
        },
      },
    };

    const response = await request(app.getHttpServer())
      .post('/empresa')
      .send({ ...createEmpresaDto, cuit: '82345678901' });
    empresaId = response.body._id;
  });

  afterAll(async () => {
    await TestSetup.closeTestApp(app);
  });

  it('/empresa (POST) - should create a new empresa', async () => {
    const response = await request(app.getHttpServer())
      .post('/empresa')
      .send(createEmpresaDto)
      .expect(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body.razon_social).toBe(createEmpresaDto.razon_social);
    expect(response.body.nombre_comercial).toBe(
      createEmpresaDto.nombre_comercial,
    );
    expect(response.body.cuit).toBe(createEmpresaDto.cuit);
  });

  it('/empresa (GET) - should return all empresas', async () => {
    const response = await request(app.getHttpServer())
      .get('/empresa')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/empresa/:id (GET) - should return a specific empresa', async () => {
    const response = await request(app.getHttpServer())
      .get(`/empresa/${empresaId}`)
      .expect(200);

    expect(response.body._id).toBe(empresaId);
    expect(response.body.razon_social).toBe(createEmpresaDto.razon_social);
    expect(response.body.nombre_comercial).toBe(
      createEmpresaDto.nombre_comercial,
    );
  });

  it('/empresa/:id (PATCH) - should update a empresa', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/empresa/${empresaId}`)
      .send(updateEmpresaDto)
      .expect(200);

    expect(response.body._id).toBe(empresaId);
    expect(response.body.nombre_comercial).toBe(
      updateEmpresaDto.nombre_comercial,
    );
    if (updateEmpresaDto.contacto) {
      expect(response.body.contacto.nombre).toBe(
        updateEmpresaDto.contacto.nombre,
      );
      expect(response.body.contacto.email).toBe(
        updateEmpresaDto.contacto.email,
      );
    }
  });

  it('/empresa/:id (DELETE) - should delete a empresa', async () => {
    await request(app.getHttpServer())
      .delete(`/empresa/${empresaId}`)
      .expect(200);
  });

  it('/empresa/:id (GET) - should return 404 after deletion', async () => {
    await request(app.getHttpServer()).get(`/empresa/${empresaId}`).expect(404);
  });
});
