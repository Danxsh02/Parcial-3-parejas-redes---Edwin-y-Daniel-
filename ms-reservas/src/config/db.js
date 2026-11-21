const mysql = require('mysql2/promise');

// dateStrings: true -> las columnas DATE llegan como 'AAAA-MM-DD' (texto)
// y no como objetos Date (que se serializarían con zona horaria y hora).
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'reservas_db',
  waitForConnections: true,
  connectionLimit: 10,
  dateStrings: true,
});

module.exports = pool;
