# ms-habitaciones · Contrato de la API

Microservicio **proveedor** del examen del Módulo 3 (solo lectura). Puerto: **3012**.
Lo consulta el microservicio de reservas, que guarda el atributo `habitacion_id`.

## Cómo ejecutarlo

Requisitos: Node.js 22.9 o superior, MySQL 8 y ms-usuarios corriendo (para obtener tokens).

1. Como root en MySQL:

```sql
CREATE DATABASE habitaciones_db;
CREATE USER 'habitaciones_user'@'localhost' IDENTIFIED BY 'una-clave-segura';
GRANT ALL PRIVILEGES ON habitaciones_db.* TO 'habitaciones_user'@'localhost';
```

2. `mysql -u habitaciones_user -p habitaciones_db` y luego `SOURCE db/schema.sql;`
3. `npm install`
4. Copiar `.env.example` como `.env`. `JWT_SECRET` debe ser **la misma de ms-usuarios**.
5. `npm run dev`

## Representación

```json
{"id": 1, "numero_habitacion": "101", "tipo": "sencilla", "capacidad": 1}
```

## Atributos

| Atributo | Tipo |
|---|---|
| id | entero |
| numero_habitacion | texto |
| tipo | texto |
| capacidad | entero |

## Endpoints

Todas las peticiones llevan `Authorization: Bearer <token>`. Cualquier rol autenticado puede consultar.

| Operación | Método | URI | Respuesta exitosa | Errores |
|---|---|---|---|---|
| Listar | GET | /habitaciones | 200 arreglo | 401 |
| Consultar por lotes | GET | /habitaciones?ids=1,3 | 200 arreglo (solo los que existen) | 400 · 401 |
| Obtener | GET | /habitaciones/:id | 200 objeto | 400 · 401 · 404 |

## Datos iniciales

| id | numero_habitacion | tipo | capacidad |
|---|---|---|---|
| 1 | 101 | sencilla | 1 |
| 2 | 204 | doble | 2 |
| 3 | 305 | familiar | 5 |
| 4 | 410 | suite | 3 |

## Para el consumidor

La carpeta `para-el-consumidor/` trae `habitaciones.client.js` con la función `pedir()` ya escrita (token y tiempo de espera). Se copia en `ms-reservas/src/clients/` y se completa.

## Frontend del examen

La carpeta `frontend/` trae `index.html`, ya configurado para ms-reservas y ms-habitaciones. No se modifica: se copia al `DocumentRoot` del host virtual del examen en servidor2, y desde Windows se abre `http://examen.<dominio>/`. La página inicia sesión por `/api/usuarios/login` y muestra los listados de `/api/reservas` y `/api/habitaciones` por el mismo nombre, así que no necesita CORS.

## Me consultan

| Me consulta | Peticiones que me hace |
|---|---|
| ms-reservas | `GET /habitaciones/:id` (validar) · `GET /habitaciones?ids=…` (componer) |
