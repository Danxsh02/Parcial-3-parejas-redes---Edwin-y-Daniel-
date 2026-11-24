-- db/schema.sql — base de datos de ms-habitaciones
SET NAMES utf8mb4;

CREATE TABLE habitaciones (
  id                   INT AUTO_INCREMENT PRIMARY KEY,
  numero_habitacion    VARCHAR(10) NOT NULL,
  tipo                 VARCHAR(30) NOT NULL,
  capacidad            INT NOT NULL
);

INSERT INTO habitaciones (numero_habitacion, tipo, capacidad) VALUES
  ('101', 'sencilla', 1),
  ('204', 'doble', 2),
  ('305', 'familiar', 5),
  ('410', 'suite', 3);
