const repo = require('../repositories/reservas.repository');
const HttpError = require('../utils/HttpError');
const { validarReserva, validarId } = require('../models/reserva');
const { obtenerHabitacion, obtenerHabitacionesPorIds } = require('../clients/habitaciones.client');

function traducirErrorDB(err) {
  if (err && err.code === 'ER_DUP_ENTRY') {
    return new HttpError(409, 'Ya existe una reserva con ese codigo');
  }
  return err;
}

function componerHabitacion(reserva, habitacion) {
  if (!habitacion) return { ...reserva, habitacion: null };
  return {
    ...reserva,
    habitacion: {
      id: habitacion.id,
      numero_habitacion: habitacion.numero_habitacion,
      tipo: habitacion.tipo,
    },
  };
}

async function listar(filtros, authHeader) {
  const reservas = await repo.findAll({ huesped: filtros.huesped });
  if (reservas.length === 0) return [];

  const ids = [...new Set(reservas.map((r) => r.habitacion_id))];
  const mapa = await obtenerHabitacionesPorIds(ids, authHeader);

  if (!mapa) {
    return reservas.map((r) => ({
      ...r,
      habitacion: null,
      aviso: 'ms-habitaciones no disponible',
    }));
  }

  return reservas.map((r) => componerHabitacion(r, mapa.get(r.habitacion_id)));
}

async function obtener(idCrudo, authHeader) {
  const id = validarId(idCrudo);
  const reserva = await repo.findById(id);
  if (!reserva) throw new HttpError(404, 'Reserva no encontrada');

  try {
    const h = await obtenerHabitacion(reserva.habitacion_id, authHeader);
    return componerHabitacion(reserva, h);
  } catch (err) {
    if (err instanceof HttpError && err.status === 503) {
      return { ...reserva, habitacion: null, aviso: err.message };
    }
    throw err;
  }
}

async function crear(body, authHeader) {
  const datos = validarReserva(body);
  const habitacion = await obtenerHabitacion(datos.habitacion_id, authHeader);

  if (datos.personas > habitacion.capacidad) {
    throw new HttpError(400, `Las personas superan la capacidad (${habitacion.capacidad})`);
  }

  if (await repo.findByCodigo(datos.codigo)) {
    throw new HttpError(409, 'Ya existe una reserva con ese codigo');
  }

  try {
    const id = await repo.create(datos);
    const creada = await repo.findById(id);
    return componerHabitacion(creada, habitacion);
  } catch (err) {
    throw traducirErrorDB(err);
  }
}

async function actualizar(idCrudo, body, authHeader) {
  const id = validarId(idCrudo);
  const existente = await repo.findById(id);
  if (!existente) throw new HttpError(404, 'Reserva no encontrada');

  const datos = validarReserva(body);
  const habitacion = await obtenerHabitacion(datos.habitacion_id, authHeader);

  if (datos.personas > habitacion.capacidad) {
    throw new HttpError(400, `Las personas superan la capacidad (${habitacion.capacidad})`);
  }

  try {
    await repo.update(id, datos);
    const actualizada = await repo.findById(id);
    return componerHabitacion(actualizada, habitacion);
  } catch (err) {
    throw traducirErrorDB(err);
  }
}

async function eliminar(idCrudo) {
  const id = validarId(idCrudo);
  const ok = await repo.remove(id);
  if (!ok) throw new HttpError(404, 'Reserva no encontrada');
}

module.exports = { listar, obtener, crear, actualizar, eliminar };