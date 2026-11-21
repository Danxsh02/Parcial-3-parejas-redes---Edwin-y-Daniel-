# ms-reservas

Microservicio de reservas (Evaluación Módulo 3). Node.js 22 + Express + MySQL 8.
Arquitectura: `routes → controller → service → repository`, con `models/reserva.js` y `HttpError`.

- Puerto: **3011**, escucha solo en `127.0.0.1`
- Base de datos: `reservas_db` (`db/schema.sql`, 4 registros iniciales)
- Seguridad: todas las rutas exigen `Authorization: Bearer <token>` (emitido por ms-usuarios).
  GET para cualquier rol; POST, PUT y DELETE solo administrador.

## Instalación

```bash
npm install
cp .env.example .env        # y completar valores
mysql -u root -p < db/schema.sql
npm start
```

## Modelo `reserva`

| Campo | Tipo | Regla |
| --- | --- | --- |
| id | entero | autogenerado |
| codigo | texto | obligatorio, **único** (409 si ya existe) |
| huesped | texto | obligatorio |
| fecha_entrada | fecha `AAAA-MM-DD` | obligatoria, fecha real |
| fecha_salida | fecha `AAAA-MM-DD` | obligatoria, **posterior** a fecha_entrada (400) |
| personas | entero | mayor que 0 |

## Contrato

Base: `/reservas`

| Método | Ruta | Rol | Éxito | Errores |
| --- | --- | --- | --- | --- |
| GET | `/reservas` | cualquiera | 200 lista | 401 |
| GET | `/reservas?huesped=Nombre` | cualquiera | 200 lista filtrada (coincidencia exacta) | 401 |
| GET | `/reservas/:id` | cualquiera | 200 | 400 id inválido, 401, 404 |
| POST | `/reservas` | administrador | 201 reserva creada | 400, 401, 403, 409 |
| PUT | `/reservas/:id` | administrador | 200 reserva actualizada (reemplazo completo) | 400, 401, 403, 404, 409 |
| DELETE | `/reservas/:id` | administrador | 204 sin cuerpo | 400, 401, 403, 404 |

Errores: `{ "error": "mensaje" }`.

### Ejemplo POST

```json
{
  "codigo": "RES-010",
  "huesped": "Ana Torres",
  "fecha_entrada": "2027-02-01",
  "fecha_salida": "2027-02-05",
  "personas": 2
}
```

## Pruebas

`docs/ms-reservas.postman_collection.json` (Postman v2.1): login admin y usuario normal + casos de
200, 201, 204, 400, 401, 403, 404 y 409. Ajustar las variables de la colección (`adminEmail`, etc.).

## Registro de peticiones

Cada petición se imprime en la terminal: `METODO /ruta CODIGO`.
