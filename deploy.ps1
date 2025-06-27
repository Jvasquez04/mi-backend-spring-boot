# Script de despliegue para POS Backend con Docker
Write-Host "🚀 Iniciando despliegue de POS Backend..." -ForegroundColor Green

# Verificar si Docker está ejecutándose
Write-Host "📋 Verificando Docker..." -ForegroundColor Yellow
try {
    docker version | Out-Null
    Write-Host "✅ Docker está ejecutándose" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker no está ejecutándose. Por favor, inicia Docker Desktop." -ForegroundColor Red
    exit 1
}

# Detener y eliminar contenedores existentes
Write-Host "🛑 Deteniendo contenedores existentes..." -ForegroundColor Yellow
docker-compose down --remove-orphans

# Construir y ejecutar los servicios
Write-Host "🔨 Construyendo y ejecutando servicios..." -ForegroundColor Yellow
docker-compose up --build -d

# Esperar a que los servicios estén listos
Write-Host "⏳ Esperando a que los servicios estén listos..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Verificar el estado de los contenedores
Write-Host "📊 Estado de los contenedores:" -ForegroundColor Yellow
docker-compose ps

# Verificar logs de la aplicación
Write-Host "📝 Logs de la aplicación:" -ForegroundColor Yellow
docker-compose logs pos-backend --tail=20

Write-Host "🎉 ¡Despliegue completado!" -ForegroundColor Green
Write-Host "📍 La aplicación está disponible en: http://localhost:8080" -ForegroundColor Cyan
Write-Host "🗄️  Base de datos MySQL disponible en: localhost:3306" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Comandos útiles:" -ForegroundColor Yellow
Write-Host "  - Ver logs: docker-compose logs -f" -ForegroundColor White
Write-Host "  - Detener servicios: docker-compose down" -ForegroundColor White
Write-Host "  - Reiniciar servicios: docker-compose restart" -ForegroundColor White 