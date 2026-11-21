const repo = require('../repositories/reservas.repository');
const HttpError = require('../utils/HttpError');
const { validarReserva, validarId } = require('../models/reserva');

function traducirErrorDB(err) {
  if (err && err.code === 'ER_DUP_ENTRY') {
    return new HttpError(409, 'Ya existe una reserva con ese codigo');
  }
  return err;
}

async function listar(filtros) {
  return repo.findAll({ huesped: filtros.huesped });
}

async function obtener(idCrudo) {
  const id = validarId(idCrudo);
  const reserva = await repo.findById(id);
  if (!reserva) throw new HttpError(404, 'Reserva no encontrada');
  return reserva;
}

async function crear(body) {
  const datos = validarReserva(body);
  if (await repo.findByCodigo(datos.codigo)) {
    throw new HttpError(409, 'Ya existe una reserva con ese codigo');
  }
  try {
    const id = await repo.create(datos);
    return await repo.findById(id);
  } catch (err) {
    throw traducirErrorDB(err);
  }
}

async function actualizar(idCrudo, body) {
  const id = validarId(idCrudo);
  const existente = await repo.findById(id);
  if (!existente) throw new HttpError(404, 'Reserva no encontrada');

  const datos = validarReserva(body);
  const otra = await repo.findByCodigo(datos.codigo);
  if (otra && otra.id !== id) {
    throw new HttpError(409, 'Ya existe una reserva con ese codigo');
  }
  try {
    await repo.update(id, datos);
    return await repo.findById(id);
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
