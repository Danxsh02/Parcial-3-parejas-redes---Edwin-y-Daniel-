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

## Pruebas (Thunder Client y Postman)

En `docs/` hay dos colecciones en formato Postman v2.1. Las dos se importan en Thunder Client
(Collections → menú → Import) o en Postman (Import). Antes de probar deben estar corriendo
ms-usuarios (puerto 3001) y ms-reservas (puerto 3011), con la **misma `JWT_SECRET`** en los dos `.env`.

| Archivo | Para qué | Casos |
| --- | --- | --- |
| `docs/thunder-collection_ms-reservas.json` | Prueba manual paso a paso en Thunder Client, con un usuario administrador y uno no administrador | 18: 200, 201, 204, 400, 401, **403**, 404 y 409 |
| `docs/ms-reservas.postman_collection.json` | Ejecución automática con el Runner (Postman o Thunder Client): guarda el token y el id solo | 16: 200, 201, 204, 400, 401, 404 y 409 |

### Colección de Thunder Client (`thunder-collection_ms-reservas.json`)

1. Crear un entorno (Env) con estas variables:

   | Variable | Valor |
   | --- | --- |
   | `url_login` | `http://127.0.0.1:3001/usuarios/login` |
   | `url_reservas` | `http://127.0.0.1:3011/reservas` |
   | `admin_email` / `admin_password` | Administrador de su ms-usuarios (por defecto `admin@empresa.com` / `Admin2026*`) |
   | `user_email` / `user_password` | Un usuario con rol distinto de administrador (por ejemplo `comercial`) |
   | `token_admin`, `token_user`, `id_creado` | Vacías: se llenan durante la prueba |

2. Ejecutar `00a` y copiar el `token` de la respuesta en `token_admin`; ejecutar `00b` y copiarlo en `token_user`.
3. Ejecutar `07` (POST 201) y copiar el `id` de la respuesta en `id_creado`.
4. Ejecutar el resto en orden. `12` demuestra el **403**: el usuario no administrador no puede crear.

Si su ms-usuarios no tiene un usuario no administrador, créelo con el token de administrador:
`POST http://127.0.0.1:3001/usuarios` con
`{"nombre":"Laura Gómez","email":"laura@agrored.com","rol":"comercial","password":"Comercial2026*"}`
(el rol debe estar en `ROLES` del `.env` de ms-usuarios).

### Colección automática (`ms-reservas.postman_collection.json`)

1. Importarla y revisar las variables de la colección: `base` (`http://127.0.0.1:3011`),
   `base_usuarios` (`http://127.0.0.1:3001`), `email` y `password` del administrador.
2. Run collection → Run. Resultado esperado: **16 peticiones y 21 pruebas aprobadas**.
   El filtro se prueba con `?huesped=Carlos Ramirez` (registros iniciales de `db/schema.sql`).

Ninguna colección guarda claves ni tokens en el repositorio: se ponen en el entorno o en las variables locales.

## Despliegue (referencia para el examen)

ms-reservas **no** se despliega en las VMs antes del examen. El día de la evaluación (persona 2):

| Archivo | Uso |
| --- | --- |
| `deploy/ms-reservas.service` | Unidad de systemd: usuario `nodeapps`, `WorkingDirectory=/srv/m3examen/app/ms-reservas` |
| `deploy/correa-munoz.conf` | Host virtual `correa-munoz.m3examen.com`: frontend en `/var/www/correa-munoz` y rutas `/api/usuarios` y `/api/reservas` |

Pasos resumidos en servidor2: clonar el repositorio en `/srv/m3examen/app`, `npm ci --omit=dev` en `ms-reservas`,
crear el `.env` (`DB_HOST=172.16.1.58`) con `chmod 640` y grupo `nodeapps`, copiar la unidad, `systemctl enable --now ms-reservas`,
copiar y activar el host virtual, y agregar `correa-munoz IN A 172.16.1.59` en la zona `m3examen.com` de servidor1.

## Registro de peticiones

Cada petición se imprime en la terminal: `METODO /ruta CODIGO`.
