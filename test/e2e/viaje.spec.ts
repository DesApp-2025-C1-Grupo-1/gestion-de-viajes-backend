/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TestSetup } from '../test-setup';
import { CreateViajeDto } from '../../src/viaje/dto/create-viaje.dto';
import { UpdateViajeDto } from '../../src/viaje/dto/update-viaje.dto';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

describe('ViajeController (e2e)', () => {
  let app: INestApplication;
  let createdViajeId: string;

  // Variables para entidades relacionadas
  let vehiculoId: string;
  let choferId: string;
  let depositoOrigenId: string;
  let depositoDestinoId: string;
  let empresaId: string;

  let createViajeDto: CreateViajeDto;
  let updateViajeDto: UpdateViajeDto;

  beforeAll(async () => {
    app = await TestSetup.createTestApp();

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

    const tipoVehiculoRes = await request(app.getHttpServer())
      .post('/tipo-vehiculo')
      .send({ nombre: 'auto', descripcion: 'Vehículo de pasajeros' });

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

    const choferRes = await request(app.getHttpServer())
      .post('/chofer')
      .send({
        nombre: 'Maria',
        apellido: 'Gonzales',
        dni: 22984756,
        fecha_nacimiento: '1975-07-15',
        licencia: 'ABC123456',
        tipo_licencia: 'C1',
        email: 'maria.gonzales@mail.com',
        vehiculo: vehiculoId,
        empresa: empresaId,
        telefono: {
          codigo_pais: '54',
          codigo_area: '223',
          numero: '1162376294',
        },
      });
    choferId = (choferRes.body as { _id: string })._id;

    const depositoOrigenRes = await request(app.getHttpServer())
      .post('/deposito')
      .send({
        nombre: 'Depósito Norte',
        lat: -34.5432,
        long: -58.4567,
        tipo: 'propio',
        horario_entrada: '08:00',
        horario_salida: '18:00',
        restricciones: 'Solo ingreso de camiones entre 08:00 y 12:00',
        direccion: {
          calle: 'Av. Libertador',
          numero: '5000',
          ciudad: 'Buenos Aires',
          estado_provincia: 'CABA',
          pais: 'Argentina',
          tipo: 'fiscal',
        },
        contacto: {
          nombre: 'Juan Pérez',
          email: 'juan@example.com',
          telefono: {
            codigo_pais: '54',
            codigo_area: '11',
            numero: '123456789',
          },
        },
      });
    depositoOrigenId = depositoOrigenRes.body._id;

    const depositoDestinoRes = await request(app.getHttpServer())
      .post('/deposito')
      .send({
        nombre: 'Depósito Sur',
        lat: -34.6037,
        long: -58.3816,
        tipo: 'propio',
        horario_entrada: '07:00',
        horario_salida: '19:00',
        restricciones: 'No se permiten entregas los domingos',
        direccion: {
          calle: 'Av. San Juan',
          numero: '1234',
          ciudad: 'Buenos Aires',
          estado_provincia: 'CABA',
          pais: 'Argentina',
          tipo: 'fiscal',
        },
        contacto: {
          nombre: 'Laura Gómez',
          email: 'laura@example.com',
          telefono: {
            codigo_pais: '54',
            codigo_area: '223',
            numero: '987654321',
          },
        },
      });
    depositoDestinoId = depositoDestinoRes.body._id;

    createViajeDto = {
      fecha_inicio: new Date('2024-02-28T00:00:00.000+00:00'),
      fecha_llegada: new Date('2024-05-01T18:30:00.000+00:00'),
      tipo_viaje: 'internacional',
      deposito_origen: depositoOrigenId,
      deposito_destino: depositoDestinoId,
      empresa: empresaId,
      chofer: choferId,
      vehiculo: vehiculoId,
    };

    updateViajeDto = {
      tipo_viaje: 'nacional',
    };
  });

  afterAll(async () => {
    await TestSetup.closeTestApp(app);
  });

  it('/viaje (POST) - debería crear un nuevo viaje', async () => {
    const response = await request(app.getHttpServer())
      .post('/viaje')
      .send(createViajeDto)
      .expect(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body.tipo_viaje).toBe(createViajeDto.tipo_viaje);
    expect(response.body.deposito_origen).toBe(createViajeDto.deposito_origen);
    expect(response.body.deposito_destino).toBe(
      createViajeDto.deposito_destino,
    );
    expect(response.body.chofer).toBe(createViajeDto.chofer);
    expect(response.body.vehiculo).toBe(createViajeDto.vehiculo);

    expect(new Date(response.body.fecha_inicio)).toEqual(
      new Date(createViajeDto.fecha_inicio),
    );
    expect(new Date(response.body.fecha_llegada)).toEqual(
      new Date(createViajeDto.fecha_llegada),
    );

    createdViajeId = response.body._id;
  });

  it('/viaje (GET) - should return all viajes', async () => {
    const response = await request(app.getHttpServer())
      .get('/viaje')
      .expect(200);

    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
  });
});
