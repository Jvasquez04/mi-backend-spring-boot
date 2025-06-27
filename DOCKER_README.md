# 🐳 Despliegue con Docker - POS Backend

Este documento explica cómo desplegar la aplicación POS Backend usando Docker.

## 📋 Prerrequisitos

- Docker Desktop instalado y ejecutándose
- Docker Compose (incluido con Docker Desktop)
- PowerShell (Windows)

## 🚀 Despliegue Rápido

### Opción 1: Script Automatizado (Recomendado)

1. Abre PowerShell en la raíz del proyecto
2. Ejecuta el script de despliegue:

```powershell
.\deploy.ps1
```

### Opción 2: Comandos Manuales

1. **Construir y ejecutar los servicios:**
```bash
docker-compose up --build -d
```

2. **Verificar el estado:**
```bash
docker-compose ps
```

3. **Ver logs en tiempo real:**
```bash
docker-compose logs -f
```

## 🌐 Acceso a la Aplicación

- **Backend API:** http://localhost:8080
- **Base de datos MySQL:** localhost:3306
  - Usuario: `posuser`
  - Contraseña: `pospass123`
  - Base de datos: `posdb`

## 📊 Credenciales de Prueba

### Usuarios del Sistema
- **Administrador:**
  - Usuario: `admin`
  - Contraseña: `admin123`

- **Cajero:**
  - Usuario: `cajero`
  - Contraseña: `cajero123`

## 🔧 Comandos Útiles

### Gestión de Contenedores
```bash
# Ver estado de los servicios
docker-compose ps

# Ver logs de un servicio específico
docker-compose logs pos-backend
docker-compose logs mysql

# Ver logs en tiempo real
docker-compose logs -f

# Detener servicios
docker-compose down

# Reiniciar servicios
docker-compose restart

# Eliminar todo (incluyendo volúmenes)
docker-compose down -v
```

### Gestión de Imágenes
```bash
# Ver imágenes
docker images

# Eliminar imágenes no utilizadas
docker image prune

# Eliminar todas las imágenes no utilizadas
docker image prune -a
```

## 🐛 Solución de Problemas

### Problema: Puerto 8080 ocupado
```bash
# Ver qué está usando el puerto 8080
netstat -ano | findstr :8080

# Cambiar puerto en docker-compose.yml
# Cambiar "8080:8080" por "8081:8080"
```

### Problema: Puerto 3306 ocupado
```bash
# Ver qué está usando el puerto 3306
netstat -ano | findstr :3306

# Cambiar puerto en docker-compose.yml
# Cambiar "3306:3306" por "3307:3306"
```

### Problema: Contenedor no inicia
```bash
# Ver logs detallados
docker-compose logs pos-backend

# Reconstruir sin caché
docker-compose build --no-cache
docker-compose up -d
```

### Problema: Base de datos no conecta
```bash
# Verificar que MySQL esté ejecutándose
docker-compose ps mysql

# Conectar a MySQL desde el contenedor
docker-compose exec mysql mysql -u posuser -p posdb
```

## 📁 Estructura de Archivos Docker

```
pos-backend/
├── docker-compose.yml          # Configuración de servicios
├── deploy.ps1                  # Script de despliegue
├── database_setup.sql          # Script de inicialización de BD
├── pos-backend/
│   ├── Dockerfile              # Configuración de imagen
│   └── .dockerignore           # Archivos a excluir
└── DOCKER_README.md            # Este archivo
```

## 🔄 Actualizaciones

Para actualizar la aplicación:

1. **Detener servicios:**
```bash
docker-compose down
```

2. **Reconstruir y ejecutar:**
```bash
docker-compose up --build -d
```

## 🗑️ Limpieza Completa

Para eliminar todo y empezar desde cero:

```bash
# Detener y eliminar contenedores, redes y volúmenes
docker-compose down -v

# Eliminar imágenes
docker rmi $(docker images -q pos-backend_pos-backend)

# Eliminar volúmenes no utilizados
docker volume prune
```

## 📞 Soporte

Si encuentras problemas:

1. Verifica que Docker Desktop esté ejecutándose
2. Revisa los logs con `docker-compose logs`
3. Asegúrate de que los puertos 8080 y 3306 estén libres
4. Verifica que tienes permisos de administrador en Windows 