// Cliente HTTP de ms-habitaciones para ms-reservas.
// Reenvía el token del usuario original (Authorization: Bearer <token>).
const HttpError = require('../utils/HttpError');

async function pedir(ruta, authHeader) {
  try {
    return await fetch(`${process.env.HABITACIONES_URL}${ruta}`, {
      headers: { Authorization: authHeader },
      signal: AbortSignal.timeout(3000),
    });
  } catch (error) {
    return null; // ms-habitaciones caído o sin responder
  }
}

// Tarea 2: validar una habitación. Lanza 503 si el proveedor no responde,
// 400 si no existe, 502 si responde algo raro. Devuelve el objeto si existe.
async function obtenerHabitacion(id, authHeader) {
  const respuesta = await pedir(`/habitaciones/${id}`, authHeader);
  if (!respuesta) throw new HttpError(503, 'ms-habitaciones no disponible');
  if (respuesta.status === 404) {
    throw new HttpError(400, `No existe la habitación con id ${id}`);
  }
  if (!respuesta.ok) throw new HttpError(502, 'Respuesta inválida de ms-habitaciones');
  return respuesta.json();
}

// Tarea 4: pedir varias en UNA sola petición ?ids=...
// Devuelve un Map(id → habitacion) o null si el proveedor no responde.
async function obtenerHabitacionesPorIds(ids, authHeader) {
  if (!ids || ids.length === 0) return new Map();
  const respuesta = await pedir(`/habitaciones?ids=${ids.join(',')}`, authHeader);
  if (!respuesta || !respuesta.ok) return null;
  const arreglo = await respuesta.json();
  return new Map(arreglo.map((h) => [h.id, h]));
}

module.exports = { obtenerHabitacion, obtenerHabitacionesPorIds };