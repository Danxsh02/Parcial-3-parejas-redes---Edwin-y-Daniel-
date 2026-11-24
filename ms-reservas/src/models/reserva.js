const HttpError = require('../utils/HttpError');

const FECHA_RE = /^\d{4}-\d{2}-\d{2}$/;

function esFechaValida(valor) {
  if (typeof valor !== 'string' || !FECHA_RE.test(valor)) return false;
  const d = new Date(`${valor}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === valor;
}

function textoValido(valor) {
  return typeof valor === 'string' && valor.trim().length > 0;
}

function validarReserva(body = {}) {
  const errores = [];

  if (!textoValido(body.codigo)) errores.push('codigo es obligatorio');
  if (!textoValido(body.huesped)) errores.push('huesped es obligatorio');
  if (!esFechaValida(body.fecha_entrada)) errores.push('fecha_entrada inválida');
  if (!esFechaValida(body.fecha_salida)) errores.push('fecha_salida inválida');
  
  if (!Number.isInteger(body.personas) || body.personas <= 0) {
    errores.push('personas debe ser mayor que 0');
  }

  if (!Number.isInteger(body.habitacion_id) || body.habitacion_id <= 0) {
    errores.push('habitacion_id debe ser un entero positivo');
  }

  if (esFechaValida(body.fecha_entrada) && esFechaValida(body.fecha_salida) && body.fecha_salida <= body.fecha_entrada) {
    errores.push('fecha_salida debe ser posterior a fecha_entrada');
  }

  if (errores.length) throw new HttpError(400, errores.join('; '));

  return {
    codigo: body.codigo.trim(),
    huesped: body.huesped.trim(),
    fecha_entrada: body.fecha_entrada,
    fecha_salida: body.fecha_salida,
    personas: body.personas,
    habitacion_id: body.habitacion_id,
  };
}

function validarId(valor) {
  const id = Number(valor);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, 'id inválido');
  return id;
}

module.exports = { validarReserva, validarId };