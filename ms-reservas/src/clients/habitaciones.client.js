const HttpError = require('../utils/HttpError');

async function pedir(ruta, authHeader) {
  try {
    const baseUrl = process.env.HABITACIONES_URL || 'http://127.0.0.1:3012';
    const respuesta = await fetch(`${baseUrl}${ruta}`, {
      headers: { Authorization: authHeader },
      signal: AbortSignal.timeout(3000),
    });
    return respuesta;
  } catch (error) {
    console.log('ERROR DE CONEXION CON EL PROVEEDOR:', error.message);
    return null;
  }
}

async function obtenerHabitacion(id, authHeader) {
  const respuesta = await pedir(`/habitaciones/${id}`, authHeader);
  if (!respuesta) throw new HttpError(503, 'ms-habitaciones no disponible');
  if (respuesta.status === 404) {
    throw new HttpError(400, `No existe la habitación con id ${id}`);
  }
  if (!respuesta.ok) throw new HttpError(502, 'Respuesta inválida de ms-habitaciones');
  return respuesta.json();
}

async function obtenerHabitacionesPorIds(ids, authHeader) {
  if (!ids || ids.length === 0) return new Map();
  const respuesta = await pedir(`/habitaciones?ids=${ids.join(',')}`, authHeader);
  if (!respuesta || !respuesta.ok) return null;
  const arreglo = await respuesta.json();
  return new Map(arreglo.map((h) => [h.id, h]));
}

module.exports = { obtenerHabitacion, obtenerHabitacionesPorIds };