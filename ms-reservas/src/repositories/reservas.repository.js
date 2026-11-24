const pool = require('../config/db');

const COLUMNAS = 'id, codigo, huesped, fecha_entrada, fecha_salida, personas, habitacion_id';

async function findAll({ huesped } = {}) {
  if (huesped) {
    const [rows] = await pool.query(
      `SELECT ${COLUMNAS} FROM reservas WHERE huesped = ? ORDER BY id`,
      [huesped]
    );
    return rows;
  }
  const [rows] = await pool.query(`SELECT ${COLUMNAS} FROM reservas ORDER BY id`);
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(`SELECT ${COLUMNAS} FROM reservas WHERE id = ?`, [id]);
  return rows[0] || null;
}

async function findByCodigo(codigo) {
  const [rows] = await pool.query(`SELECT ${COLUMNAS} FROM reservas WHERE codigo = ?`, [codigo]);
  return rows[0] || null;
}

async function create(d) {
  const [result] = await pool.query(
    'INSERT INTO reservas (codigo, huesped, fecha_entrada, fecha_salida, personas, habitacion_id) VALUES (?, ?, ?, ?, ?, ?)',
    [d.codigo, d.huesped, d.fecha_entrada, d.fecha_salida, d.personas, d.habitacion_id]
  );
  return result.insertId;
}

async function update(id, d) {
  const [result] = await pool.query(
    'UPDATE reservas SET codigo = ?, huesped = ?, fecha_entrada = ?, fecha_salida = ?, personas = ?, habitacion_id = ? WHERE id = ?',
    [d.codigo, d.huesped, d.fecha_entrada, d.fecha_salida, d.personas, d.habitacion_id, id]
  );
  return result.affectedRows > 0;
}

async function remove(id) { 
  const [result] = await pool.query('DELETE FROM reservas WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = { findAll, findById, findByCodigo, create, update, remove };