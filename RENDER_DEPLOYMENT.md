# 🚀 Despliegue en Render - POS Backend

Guía paso a paso para desplegar tu aplicación POS Backend en Render sin base de datos.

## 📋 Prerrequisitos

- Cuenta en Render.com
- Repositorio en GitHub con tu código
- Docker instalado (opcional, para pruebas locales)

## 🔧 Configuración del Proyecto

### 1. Estructura del Repositorio
```
pos-backend/
├── pos-backend/
│   ├── Dockerfile              # Configuración de Docker
│   ├── .dockerignore           # Archivos a excluir
│   ├── pom.xml                 # Dependencias Maven
│   └── src/                    # Código fuente
├── docker-compose.yml          # Para pruebas locales
└── README.md
```

### 2. Archivos Clave Creados
- `InMemorySecurityConfig.java` - Autenticación en memoria
- `SimpleAuthController.java` - Login simplificado
- `SimpleProductoController.java` - Productos en memoria
- `SimpleCategoriaController.java` - Categorías en memoria
- `SimpleDashboardController.java` - Dashboard con datos de ejemplo

## 🌐 Configuración en Render

### Paso 1: Crear Nuevo Servicio Web

1. Ve a [Render Dashboard](https://dashboard.render.com)
2. Haz clic en "New +" → "Web Service"
3. Conecta tu repositorio de GitHub

### Paso 2: Configurar el Servicio

**Configuración Básica:**
- **Name:** `pos-backend-api`
- **Environment:** `Docker`
- **Region:** `Oregon (US West)` (o la más cercana)
- **Branch:** `main`
- **Root Directory:** `pos-backend`

**Configuración Avanzada:**
- **Build Command:** (dejar vacío - Docker se encarga)
- **Start Command:** (dejar vacío - Docker se encarga)

### Paso 3: Variables de Entorno

No necesitas variables de entorno ya que estamos usando autenticación en memoria.

### Paso 4: Desplegar

1. Haz clic en "Create Web Service"
2. Render comenzará a construir tu aplicación
3. Monitorea los logs para ver el progreso

## 🔐 Credenciales de Acceso

### Usuarios del Sistema
- **Administrador:**
  - Usuario: `admin`
  - Contraseña: `admin1234`

- **Cajero:**
  - Usuario: `cajero`
  - Contraseña: `cajero1234`

## 📊 Datos de Ejemplo

### Productos Predefinidos
- Cerveza Pilsen - S/ 3.50
- Whisky Jack Daniels - S/ 45.00
- Vino Tinto - S/ 25.00

### Categorías Predefinidas
- Cervezas
- Licores
- Vinos
- Snacks
- Servicios

## 🔧 Comandos Útiles

### Verificar el Despliegue
```bash
# Verificar que la API responde
curl https://tu-app.onrender.com/api/auth/test

# Probar login
curl -X POST https://tu-app.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin1234"}'
```

### Logs en Render
- Ve a tu servicio en Render Dashboard
- Haz clic en "Logs" para ver los logs en tiempo real

## 🐛 Solución de Problemas

### Problema: Build Falla
**Síntoma:** Error en la construcción de Docker
**Solución:**
1. Verifica que el Dockerfile esté en la carpeta correcta
2. Asegúrate de que `pom.xml` esté presente
3. Revisa los logs de build en Render

### Problema: Aplicación No Inicia
**Síntoma:** Error 503 o aplicación no responde
**Solución:**
1. Verifica los logs de la aplicación
2. Asegúrate de que el puerto esté configurado correctamente
3. Verifica que el perfil `docker` esté activo

### Problema: CORS Error
**Síntoma:** Error de CORS en el frontend
**Solución:**
- La configuración CORS ya está incluida en `InMemorySecurityConfig.java`

## 🔄 Actualizaciones

Para actualizar tu aplicación:

1. **Hacer cambios en tu código**
2. **Commit y push a GitHub:**
```bash
git add .
git commit -m "Actualización de la aplicación"
git push origin main
```
3. **Render detectará automáticamente los cambios y redeployará**

## 📱 Integración con Frontend

Una vez que tu backend esté desplegado:

1. **Actualiza la URL del API en tu frontend:**
```javascript
// Cambiar de localhost:8080 a tu URL de Render
const API_BASE_URL = 'https://tu-app.onrender.com';
```

2. **Prueba la conexión:**
```javascript
fetch('https://tu-app.onrender.com/api/auth/test')
  .then(response => response.text())
  .then(data => console.log(data));
```

## 🎯 Próximos Pasos

1. **Desplegar el Frontend** en Vercel, Netlify o Render
2. **Configurar dominio personalizado** (opcional)
3. **Implementar base de datos real** cuando sea necesario
4. **Configurar monitoreo y alertas**

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs en Render Dashboard
2. Verifica que todos los archivos estén en las ubicaciones correctas
3. Asegúrate de que el repositorio esté sincronizado con GitHub
4. Contacta soporte de Render si es necesario

---

¡Tu aplicación POS estará funcionando en internet en minutos! 🚀 