# Gestión de Viajes – Backend (NestJS + MongoDB)

API REST para gestionar empresas, choferes, vehículos, viajes y distribución de viajes. Construida con NestJS 11 y MongoDB (Mongoose).

## Requisitos previos

- Node.js LTS (20.x recomendado) y npm
- Acceso a una base de datos MongoDB (Atlas)

## Configuración del proyecto

1) Instalar dependencias

```powershell
npm install
```

2) Variables de entorno

Crea un archivo `.env` en la raíz del backend (puedes basarte en estos campos):

- `PORT` (opcional): Puerto de la API (por defecto 3000).
- `MONGO_USER` / `MONGO_PASS`: Credenciales de MongoDB Atlas usadas por `DatabaseModule`.
- `NODE_ENV`: usa `test` para activar MongoDB en memoria durante pruebas.

3) Compilar (TypeScript → dist)

```powershell
npm run build
```

## Ejecutar la API

- Desarrollo (watch):

```powershell
npm run start:dev
```

- Producción (desde `dist/`):

```powershell
npm run start:prod
```

La API queda disponible en `http://localhost:3000` (o el puerto configurado).

## Documentación de la API (Swagger)

- UI: `http://localhost:3000/api-docs`
- JSON: `http://localhost:3000/api-json`

Swagger está habilitado en `src/main.ts` (con esquema y auth Bearer opcional).

## Endpoints principales (ejemplos)

- Viajes: `GET /viaje?limit=10&page=1`, `GET /viaje/:id`, `POST /viaje`
- Viajes de distribución: `GET /viaje-distribucion?limit=10&page=1`
- Públicos: `GET /public/empresas/v1`, `GET /public/vehiculos/v1`, `GET /public/tipos_vehiculo/v1`

Paginación: parámetros `page` y `limit` (por defecto 1 y 10).

## Pruebas

- Unitarias/Integración (Vitest con cobertura):

```powershell
npm test
```

- Entorno de prueba: con `NODE_ENV=test` el proyecto usa MongoDB en memoria (no requiere DB externa).

## Despliegue

- Se realizo el despliegue en Render (https://gestion-de-viajes.onrender.com/)
- Swagger disponible en `/api-docs`.


## Estructura del proyecto (resumen)

```
src/
	app.module.ts
	main.ts
	database/
	empresa/ chofer/ vehiculo/ viaje/ viaje_distribucion/ public/ ...
```

- Validación global y CORS en `main.ts`.
- Swagger configurado en `main.ts` (`/api-docs`, `/api-json`).
- Conexión a MongoDB en `src/database/database.module.ts`.

---