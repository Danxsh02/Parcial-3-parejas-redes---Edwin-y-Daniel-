// OJO: reemplacen este archivo por el auth.js de SU ms-usuarios.
// Esta es una versión equivalente para que el proyecto funcione de entrada.
// Supuestos: token JWT firmado con JWT_SECRET, con el rol en "rol" o "role".
const jwt = require('jsonwebtoken');
const HttpError = require('../utils/HttpError');

function autenticar(req, res, next) {
  const header = req.headers.authorization || '';
  const [tipo, token] = header.split(' ');
  if (tipo !== 'Bearer' || !token) {
    return next(new HttpError(401, 'Token requerido'));
  }
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (e) {
    next(new HttpError(401, 'Token inválido o vencido'));
  }
}

function soloAdministrador(req, res, next) {
  const rol = String(req.usuario?.rol || req.usuario?.role || '').toLowerCase();
  if (rol !== 'administrador' && rol !== 'admin') {
    return next(new HttpError(403, 'Solo el administrador puede realizar esta acción'));
  }
  next();
}

module.exports = { autenticar, soloAdministrador };
