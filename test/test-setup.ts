import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { beforeAll, afterAll } from 'vitest';
import path from 'path';
import dotenv from 'dotenv';

const envTestPath = path.resolve(__dirname, '../test/.env.test');

const { parsed: envTest, error } = dotenv.config({
  path: envTestPath,
});

if (error)
  throw new Error(
    `Error loading environment variables from ${envTestPath}: ${error.message}`,
  );

console.group('Environment Variables');
console.table(envTest);
console.groupEnd();

export class TestSetup {
  static async createTestApp(): Promise<INestApplication> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = moduleFixture.createNestApplication();
    await app.init();
    return app;
  }

  static async closeTestApp(app: INestApplication): Promise<void> {
    await app.close();
  }
}

let app: INestApplication;

beforeAll(async () => {
  app = await TestSetup.createTestApp();
});

afterAll(async () => {
  await TestSetup.closeTestApp(app);
});
