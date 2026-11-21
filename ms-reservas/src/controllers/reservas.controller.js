const service = require('../services/reservas.service');

// Envuelve handlers async para que los errores lleguen al manejador de errores.
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const listar = wrap(async (req, res) => {
  res.status(200).json(await service.listar({ huesped: req.query.huesped }));
});

const obtener = wrap(async (req, res) => {
  res.status(200).json(await service.obtener(req.params.id));
});

const crear = wrap(async (req, res) => {
  res.status(201).json(await service.crear(req.body));
});

const actualizar = wrap(async (req, res) => {
  res.status(200).json(await service.actualizar(req.params.id, req.body));
});

const eliminar = wrap(async (req, res) => {
  await service.eliminar(req.params.id);
  res.status(204).send();
});

module.exports = { listar, obtener, crear, actualizar, eliminar };
