CREATE DATABASE IF NOT EXISTS reservas_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE reservas_db;

CREATE TABLE IF NOT EXISTS reservas (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  codigo        VARCHAR(50)  NOT NULL,
  huesped       VARCHAR(120) NOT NULL,
  fecha_entrada DATE         NOT NULL,
  fecha_salida  DATE         NOT NULL,
  personas      INT          NOT NULL,
  CONSTRAINT uq_reservas_codigo UNIQUE (codigo),
  CONSTRAINT chk_reservas_personas CHECK (personas > 0),
  CONSTRAINT chk_reservas_fechas CHECK (fecha_salida > fecha_entrada)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO reservas (codigo, huesped, fecha_entrada, fecha_salida, personas) VALUES
  ('RES-001', 'Carlos Ramirez', '2026-12-01', '2026-12-05', 2),
  ('RES-002', 'Laura Gomez',    '2026-12-10', '2026-12-12', 1),
  ('RES-003', 'Andres Perez',   '2026-12-20', '2026-12-27', 4),
  ('RES-004', 'Carlos Ramirez', '2027-01-05', '2027-01-08', 3);
