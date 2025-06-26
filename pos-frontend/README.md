# Sistema POS - Licorería Billar

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn
- Backend corriendo en http://localhost:8080

### Instalación y Ejecución

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar el frontend:**
   ```bash
   npm start
   ```

3. **Abrir en el navegador:**
   ```
   http://localhost:3000
   ```

## 🔐 Credenciales de Acceso

### Usuario Administrador
- **Usuario:** `admin`
- **Contraseña:** `admin`
- **Permisos:** Acceso completo al sistema

### Usuario Cajero
- **Usuario:** `cajero`
- **Contraseña:** `password`
- **Permisos:** Gestión de ventas y productos

## 📱 Funcionalidades

### Páginas Públicas
- **Home:** Página principal con información del negocio
- **Menú:** Catálogo de productos disponibles
- **Contacto:** Información de contacto y ubicación
- **Login:** Acceso al sistema interno

### Sistema Interno (Requiere autenticación)
- **Dashboard:** Panel principal con estadísticas
- **Productos:** Gestión de inventario
- **Categorías:** Administración de categorías
- **Ventas:** Registro y gestión de ventas
- **Reportes:** Análisis y reportes de ventas

## 🛠️ Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
├── contexts/           # Contextos de React (Auth, etc.)
├── layouts/            # Layouts de la aplicación
├── pages/              # Páginas principales
├── services/           # Servicios para API calls
└── utils/              # Utilidades y helpers
```

## 🔧 Configuración

### Variables de Entorno
Crear archivo `.env` en la raíz del proyecto:
```
REACT_APP_API_URL=http://localhost:8080/api
```

### Backend
Asegúrate de que el backend esté corriendo en `http://localhost:8080` antes de iniciar el frontend.

## 🐛 Solución de Problemas

### El login no aparece
1. Verifica que estés en la ruta `/auth`
2. Asegúrate de que el backend esté corriendo
3. Revisa la consola del navegador para errores

### Error de conexión con el backend
1. Verifica que el backend esté corriendo en el puerto 8080
2. Revisa que no haya problemas de CORS
3. El sistema tiene credenciales de prueba como fallback

### Problemas de compilación
1. Elimina `node_modules` y `package-lock.json`
2. Ejecuta `npm install` nuevamente
3. Reinicia el servidor de desarrollo

## 📞 Soporte

Si encuentras algún problema, verifica:
1. Que todas las dependencias estén instaladas
2. Que el backend esté funcionando correctamente
3. Los logs en la consola del navegador
4. Los logs del servidor de desarrollo

## 🎯 Próximas Mejoras

- [ ] Integración completa con el backend
- [ ] Gestión de usuarios y roles
- [ ] Reportes avanzados
- [ ] Notificaciones en tiempo real
- [ ] Modo offline
- [ ] Aplicación móvil
