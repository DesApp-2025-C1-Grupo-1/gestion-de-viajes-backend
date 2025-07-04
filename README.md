# 🚛 GEstión de Viajes - Backend (NestJS + MongoDB)

Este es el backend del sistema de gestión logística desarrollado con [NestJS](https://nestjs.com/) y [MongoDB Atlas](https://www.mongodb.com/atlas). La API expone endpoints RESTful para gestionar entidades como empresas, depósitos, contactos, direcciones, vehículos y más.

---

## ⚙️ Tecnologías

- [NestJS](https://nestjs.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Mongoose](https://mongoosejs.com/)
- [Swagger](https://swagger.io/) para documentación de la API
- [Class Validator](https://github.com/typestack/class-validator) para validaciones
- [Dotenv](https://github.com/motdotla/dotenv) para manejar variables de entorno

## 🚀 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/tu-repo.git
   cd tu-repo
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar las variables de entorno**

   Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:

   ```env
    MONGO_USER= mongo_user
    MONGO_PASS= mongo_pass
   ```

4. **Iniciar el servidor en modo desarrollo**
   ```bash
   npm run start:dev
   ```

## 📚 Documentación de la API

Una vez que el servidor esté corriendo, accedé a:

```
http://localhost:3000/api-docs
```

Ahí se puede ver la documentación de la API con Swagger UI.

## 🛠 Scripts útiles

| Comando                 | Descripción                         |
|------------------------|-------------------------------------|
| `npm run start`        | Inicia el servidor en producción    |
| `npm run start:dev`    | Inicia el servidor en modo desarrollo |

## 🧾 Licencia

Este proyecto está licenciado bajo MIT.

