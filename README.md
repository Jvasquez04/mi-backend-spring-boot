# Sistema POS - Licorería Billar

Sistema de punto de venta completo para licorería y billar con frontend en React y backend en Spring Boot.

## 🚀 Características

### Frontend (React + TypeScript + Material-UI)
- ✅ **Autenticación completa** con roles (Administrador/Cajero)
- ✅ **Dashboard responsivo** con navegación entre secciones
- ✅ **Gestión de productos** (CRUD completo)
- ✅ **Punto de venta (POS)** con carrito de compras
- ✅ **Escáner de código de barras** (simulado)
- ✅ **Cálculo automático de IVA** y cambio
- ✅ **Interfaz moderna** y fácil de usar

### Backend (Spring Boot + MySQL)
- ✅ **API REST** completa
- ✅ **Autenticación JWT** (configurada)
- ✅ **Base de datos MySQL** con datos de prueba
- ✅ **Gestión de usuarios** y roles
- ✅ **CORS configurado** para desarrollo

## 📋 Prerrequisitos

- **Java 17** o superior
- **Node.js 16** o superior
- **MySQL 8.0** o superior
- **Maven** (incluido con Spring Boot)
- **npm** o **yarn**

## 🛠️ Instalación

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd pos-backend
```

### 2. Configurar la base de datos
1. Asegúrate de que MySQL esté corriendo
2. Crea una base de datos (opcional, se crea automáticamente):
```sql
CREATE DATABASE pos_licoreria;
```

### 3. Configurar el backend
1. Edita `src/main/resources/application.properties` si necesitas cambiar la configuración de la base de datos
2. Compila el proyecto:
```bash
mvn clean compile
```

### 4. Configurar el frontend
```bash
cd pos-frontend
npm install
```

## 🚀 Ejecución

### Backend
```bash
# Desde la raíz del proyecto
mvn spring-boot:run
```
El backend estará disponible en: `http://localhost:8080`

### Frontend
```bash
# Desde la carpeta pos-frontend
npm start
```
El frontend estará disponible en: `http://localhost:3000`

## 🔐 Credenciales de Acceso

### Usuario Administrador
- **Usuario:** `admin`
- **Contraseña:** `admin123`
- **Permisos:** Acceso completo al sistema

### Usuario Cajero
- **Usuario:** `cajero`
- **Contraseña:** `cajero123`
- **Permisos:** Gestión de ventas y visualización de productos

## 📱 Funcionalidades

### Páginas Públicas
- **Home:** Página principal con información del negocio
- **Menú:** Catálogo de productos disponibles
- **Contacto:** Información de contacto y ubicación
- **Login:** Acceso al sistema interno

### Sistema Interno (Requiere autenticación)

#### Dashboard
- Panel principal con estadísticas
- Navegación a todas las secciones
- Información del usuario logueado

#### Productos
- **Listar productos** con tabla completa
- **Agregar productos** con formulario
- **Editar productos** existentes
- **Eliminar productos** con confirmación
- **Escáner de código de barras** (simulado)
- **Gestión de stock** y precios
- **Filtros por categoría**

#### Ventas (POS)
- **Búsqueda de productos** por nombre o código
- **Escáner de código de barras** (simulado)
- **Carrito de compras** interactivo
- **Cálculo automático** de subtotal, IVA y total
- **Múltiples métodos de pago** (efectivo, tarjeta, transferencia)
- **Cálculo de cambio** automático
- **Finalización de venta** con confirmación

#### Categorías
- Gestión de categorías de productos
- Formulario para agregar/editar categorías

#### Reportes
- Estadísticas de ventas
- Reportes de inventario
- Análisis de productos más vendidos

#### Configuración
- Ajustes del sistema
- Gestión de usuarios

## 🗄️ Estructura de la Base de Datos

### Tablas principales:
- **usuarios:** Gestión de usuarios y roles
- **categorias:** Categorías de productos
- **productos:** Inventario de productos
- **ventas:** Registro de ventas
- **detalle_ventas:** Detalle de productos en cada venta

### Datos de prueba incluidos:
- 5 categorías (Cervezas, Licores, Vinos, Snacks, Servicios)
- 5 productos de ejemplo
- 2 usuarios (admin y cajero)

## 🔧 Configuración Avanzada

### Variables de entorno (Frontend)
Crear archivo `.env` en `pos-frontend/`:
```
REACT_APP_API_URL=http://localhost:8080/api
```

### Configuración de CORS
El backend está configurado para aceptar peticiones desde `http://localhost:3000`

### Configuración de JWT
Las claves JWT están configuradas en `application.properties`

## 🐛 Solución de Problemas

### El backend no inicia
1. Verifica que MySQL esté corriendo
2. Revisa las credenciales en `application.properties`
3. Asegúrate de que el puerto 8080 esté libre

### El frontend no se conecta al backend
1. Verifica que el backend esté corriendo en puerto 8080
2. Revisa la consola del navegador para errores de CORS
3. Verifica la configuración de la API URL

### Error de autenticación
1. Usa las credenciales correctas: `admin/admin123` o `cajero/cajero123`
2. Verifica que el backend esté funcionando
3. Revisa los logs del backend para errores

### Problemas de compilación
1. Limpia y reinstala las dependencias:
```bash
# Backend
mvn clean install

# Frontend
rm -rf node_modules package-lock.json
npm install
```

## 📈 Próximas Mejoras

- [ ] **Escáner real de código de barras** con cámara
- [ ] **Impresión de tickets** de venta
- [ ] **Reportes avanzados** con gráficas
- [ ] **Gestión de inventario** con alertas de stock bajo
- [ ] **Múltiples sucursales** y usuarios
- [ ] **Backup automático** de base de datos
- [ ] **Aplicación móvil** para inventario
- [ ] **Integración con proveedores** para reposición automática

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si encuentras algún problema o tienes preguntas:

1. Revisa la sección de solución de problemas
2. Verifica los logs del backend y frontend
3. Asegúrate de que todas las dependencias estén instaladas
4. Verifica que los puertos 3000 y 8080 estén disponibles

---

**¡Disfruta usando tu sistema POS! 🎉** 