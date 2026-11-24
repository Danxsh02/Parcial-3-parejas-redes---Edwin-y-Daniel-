require('dotenv').config();
const express = require('express');
const logger = require('./middleware/logger');
const routes = require('./routes/reservas.routes');
const HttpError = require('./utils/HttpError');

const app = express();

app.use(logger);
app.use(express.json());
app.use('/reservas', routes);

app.use((req, res, next) => next(new HttpError(404, 'Ruta no encontrada')));

// Manejador de errores
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON inválido' });
  }
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = Number(process.env.PORT || 3011);
const HOST = process.env.HOST || '127.0.0.1';

app.listen(PORT, HOST, () => {
  console.log(`ms-reservas escuchando en http://${HOST}:${PORT}`);
});