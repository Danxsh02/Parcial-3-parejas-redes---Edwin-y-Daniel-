// =====================================================================
// CLIENTE HTTP de ms-habitaciones, para el microservicio de reservas.
// Copie este archivo en ms-reservas/src/clients/ y COMPLÉTELO:
// la función pedir() ya está hecha; faltan las funciones que usan
// la validación, la regla de negocio y la composición.
// En el .env de ms-reservas:  HABITACIONES_URL=http://127.0.0.1:3012
// =====================================================================
const HttpError = require('../utils/http-error');
const HABITACIONES_URL = process.env.HABITACIONES_URL;

// Hace una petición GET a ms-habitaciones reenviando el token del usuario.
// Devuelve la respuesta de fetch, o null si ms-habitaciones no respondió.
async function pedir(ruta, token) {
  try {
    return await fetch(`${HABITACIONES_URL}${ruta}`, {
      headers: { Authorization: token },     // el token de la petición original
      signal: AbortSignal.timeout(3000),      // no esperar más de 3 segundos
    });
  } catch (error) {
    return null;                              // ms-habitaciones caído o sin responder
  }
}

// Ejemplo de uso:
//   const respuesta = await pedir('/habitaciones/3', token);
//   if (!respuesta) ...                   → ms-habitaciones no respondió
//   if (respuesta.status === 404) ...     → no existe
//   const datos = await respuesta.json(); → el objeto (o el arreglo, con ?ids=)

module.exports = { pedir };
