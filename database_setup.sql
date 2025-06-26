-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS posdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE posdb;

-- Crear tabla de categorías
CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    rol ENUM('ADMINISTRADOR', 'CAJERO') NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crear tabla de productos
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    categoria_id INT,
    imagen VARCHAR(255),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- Crear tabla de ventas
CREATE TABLE IF NOT EXISTS ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id INT,
    total DECIMAL(10,2) NOT NULL,
    metodo_pago VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Crear tabla de detalles de venta
CREATE TABLE IF NOT EXISTS detalles_venta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT,
    producto_id INT,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (venta_id) REFERENCES ventas(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Insertar categorías de prueba
INSERT INTO categorias (nombre, descripcion, activo) VALUES 
('Cervezas', 'Variedad de cervezas nacionales e importadas', true),
('Licores', 'Licores premium y de alta calidad', true),
('Vinos', 'Vinos tintos, blancos y rosados', true),
('Snacks', 'Aperitivos y botanas', true),
('Servicios', 'Servicios de billar y otros', true);

-- Insertar usuarios de prueba (password: admin123 y cajero123, encriptadas con bcrypt)
INSERT INTO usuarios (username, password, nombre, email, rol, activo) VALUES 
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrador', 'admin@licoreria.com', 'ADMINISTRADOR', true),
('cajero', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Cajero', 'cajero@licoreria.com', 'CAJERO', true);

-- Mostrar las tablas creadas
SHOW TABLES;

-- Mostrar datos de prueba
SELECT * FROM categorias;
SELECT p.*, c.nombre as categoria_nombre FROM productos p JOIN categorias c ON p.categoria_id = c.id;
SELECT id, username, nombre, email, rol, activo FROM usuarios; 