-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS Local_POS_DB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Otorgar todos los privilegios en la base de datos Local_POS_DB al usuario root
GRANT ALL PRIVILEGES ON Local_POS_DB.* TO 'root'@'localhost';

-- Aplicar los cambios
FLUSH PRIVILEGES;

-- Verificar que la base de datos existe
SHOW DATABASES LIKE 'Local_POS_DB'; 