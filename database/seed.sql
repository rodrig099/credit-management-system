USE creditos_db;

-- Limpiar datos existentes (solo para desarrollo)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE transacciones;
TRUNCATE TABLE pagos;
TRUNCATE TABLE creditos;
TRUNCATE TABLE usuarios;
SET FOREIGN_KEY_CHECKS = 1;

-- Insertar usuario administrador
-- Password: 123456 (misma que la cédula, hash de bcrypt)
INSERT INTO usuarios (cedula, password, nombres, apellidos, direccion, telefono, rol) VALUES
('123456', '$2a$10$YQh7ykXgZPEQJQXVQX5jXeqKGZqLvKZUZhBGjKVPGqLvKZUZhBGjK', 'Admin', 'Sistema', 'Oficina Central', '3001234567', 'admin');

-- Insertar clientes de prueba (contraseña = cédula para todos)
INSERT INTO usuarios (cedula, password, nombres, apellidos, direccion, telefono, rol) VALUES
('789012', '$2a$10$YQh7ykXgZPEQJQXVQX5jXeqKGZqLvKZUZhBGjKVPGqLvKZUZhBGjK', 'Diana', 'Carolina', 'Calle 5 #10-20', '3109876543', 'cliente'),
('345678', '$2a$10$YQh7ykXgZPEQJQXVQX5jXeqKGZqLvKZUZhBGjKVPGqLvKZUZhBGjK', 'Juan', 'Gabriel', 'Carrera 8 #15-30', '3207654321', 'cliente'),
('901234', '$2a$10$YQh7ykXgZPEQJQXVQX5jXeqKGZqLvKZUZhBGjKVPGqLvKZUZhBGjK', 'Nancy', 'Morales', 'Avenida 12 #8-45', '3156789012', 'cliente');

-- Insertar crédito de prueba para Diana Carolina
INSERT INTO creditos (cliente_id, monto_total, cuota_valor, numero_cuotas, frecuencia, fecha_inicio, estado) VALUES
(2, 580000, 10000, 58, 'diario', '2025-08-11', 'activo');

-- Insertar pagos para el crédito de Diana (primeros 10 pagos como ejemplo)
INSERT INTO pagos (credito_id, numero_pago, fecha_programada, cuota_valor, monto_pagado, saldo_restante, estado, fecha_pago) VALUES
(1, 1, '2025-08-11', 10000, 10000, 570000, 'pagado', '2025-08-11 10:30:00'),
(1, 2, '2025-08-12', 10000, 15000, 555000, 'pagado', '2025-08-12 11:00:00'),
(1, 3, '2025-08-13', 10000, 5000, 550000, 'parcial', '2025-08-13 09:45:00'),
(1, 4, '2025-11-01', 10000, 0, 540000, 'pendiente', NULL),
(1, 5, '2025-11-02', 10000, 0, 530000, 'pendiente', NULL),
(1, 6, '2025-11-03', 10000, 0, 520000, 'pendiente', NULL),
(1, 7, '2025-11-04', 10000, 0, 510000, 'pendiente', NULL),
(1, 8, '2025-11-05', 10000, 0, 500000, 'pendiente', NULL),
(1, 9, '2025-11-06', 10000, 0, 490000, 'pendiente', NULL),
(1, 10, '2025-11-07', 10000, 0, 480000, 'pendiente', NULL);

-- Actualizar el pago 2 con abono
UPDATE pagos SET abono = 5000 WHERE id = 2;

-- Insertar más créditos de ejemplo
INSERT INTO creditos (cliente_id, monto_total, cuota_valor, numero_cuotas, frecuencia, fecha_inicio, estado) VALUES
(3, 1160000, 145000, 8, 'semanal', '2025-09-29', 'activo'),
(4, 1500000, 250000, 6, 'semanal', '2025-09-29', 'activo');

-- Insertar pagos para Juan Gabriel (8 pagos semanales)
INSERT INTO pagos (credito_id, numero_pago, fecha_programada, cuota_valor, saldo_restante, estado) VALUES
(2, 1, '2025-09-29', 145000, 1015000, 'mora'),
(2, 2, '2025-10-06', 145000, 870000, 'mora'),
(2, 3, '2025-10-13', 145000, 725000, 'mora'),
(2, 4, '2025-10-20', 145000, 580000, 'mora'),
(2, 5, '2025-10-27', 145000, 435000, 'mora'),
(2, 6, '2025-11-03', 145000, 290000, 'pendiente'),
(2, 7, '2025-11-10', 145000, 145000, 'pendiente'),
(2, 8, '2025-11-17', 145000, 0, 'pendiente');

-- Insertar pagos para Nancy (6 pagos semanales)
INSERT INTO pagos (credito_id, numero_pago, fecha_programada, cuota_valor, saldo_restante, estado) VALUES
(3, 1, '2025-09-29', 250000, 1250000, 'mora'),
(3, 2, '2025-10-06', 250000, 1000000, 'mora'),
(3, 3, '2025-10-13', 250000, 750000, 'mora'),
(3, 4, '2025-10-20', 250000, 500000, 'mora'),
(3, 5, '2025-10-27', 250000, 250000, 'mora'),
(3, 6, '2025-11-03', 250000, 0, 'pendiente');

-- Mensaje de confirmación
SELECT 'Base de datos inicializada correctamente!' as mensaje;
SELECT COUNT(*) as total_usuarios FROM usuarios;
SELECT COUNT(*) as total_creditos FROM creditos;
SELECT COUNT(*) as total_pagos FROM pagos;