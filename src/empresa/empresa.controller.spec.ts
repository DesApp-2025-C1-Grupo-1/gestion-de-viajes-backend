import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { EmpresaModule } from './empresa.module';
import { MongooseModule } from '@nestjs/mongoose';

describe('EmpresaController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/test'),
        EmpresaModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/empresa (POST)', async () => {
    const res = await request(app.getHttpServer())
      .post('/empresa')
      .send({
        razon_social: 'Test SA',
        nombre_comercial: 'TestCom',
        cuit: 12345678901,
        domicilio_fiscal: 'Calle Falsa 123',
        telefono: 123456789,
        mail: 'test@mail.com',
        nombre_contacto: 'Juan Perez',
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
  });

  it('/empresa (GET)', async () => {
    const res = await request(app.getHttpServer()).get('/empresa');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
}); 