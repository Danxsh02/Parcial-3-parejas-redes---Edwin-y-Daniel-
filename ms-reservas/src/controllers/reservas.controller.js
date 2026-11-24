const service = require('../services/reservas.service');

const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const listar = wrap(async (req, res) => {
  res.status(200).json(
    await service.listar({ huesped: req.query.huesped }, req.headers.authorization)
  );
});

const obtener = wrap(async (req, res) => {
  res.status(200).json(await service.obtener(req.params.id, req.headers.authorization));
});

const crear = wrap(async (req, res) => {
  res.status(201).json(await service.crear(req.body, req.headers.authorization));
});

const actualizar = wrap(async (req, res) => {
  res.status(200).json(await service.actualizar(req.params.id, req.body, req.headers.authorization));
});

const eliminar = wrap(async (req, res) => {
  await service.eliminar(req.params.id);
  res.status(204).send();
});

module.exports = { listar, obtener, crear, actualizar, eliminar };