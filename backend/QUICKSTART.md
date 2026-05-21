# Sisio Interculturaap Backend - Quick Start

## Requisitos

- Python 3.8+
- Supabase project (for database)
- pip package manager

## Instalación Rápida

### 1. Configurar variables de entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env con tus credenciales de Supabase
# Necesitas:
# - SUPABASE_URL
# - SUPABASE_KEY
# - JWT_SECRET_KEY (cualquier string fuerte)
```

### 2. Instalar dependencias

```bash
# Con venv (recomendado)
python -m venv venv
source venv/bin/activate  # Linux/Mac
# o
venv\Scripts\activate  # Windows

# Instalar paquetes
pip install -r requirements.txt
```

### 3. Crear tablas en Supabase

- Ir a https://app.supabase.com
- Abrir tu proyecto
- Ir a SQL Editor
- Ejecutar el script `database_schema.sql` (copiar y pegar el contenido)

### 4. Ejecutar el servidor

**Windows:**
```bash
.\start.bat
```

**Linux/Mac:**
```bash
./start.sh
```

O ejecutar directamente:
```bash
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Verificar que funciona

El servidor estará en: http://localhost:8000

- API Docs: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc
- Health check: http://localhost:8000/health

## Endpoints principales

### Auth
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Login
- `POST /api/auth/guest` - Crear usuario guest
- `GET /api/auth/me` - Obtener perfil actual

### Sightings
- `GET /api/sightings` - Listar avistamientos
- `POST /api/sightings` - Crear avistamiento
- `GET /api/sightings/{id}` - Obtener avistamiento

### Birds
- `GET /api/birds` - Listar aves
- `GET /api/birds/{id}` - Obtener ave
- `POST /api/birds/identify-photo` - Identificar por foto
- `POST /api/birds/identify-audio` - Identificar por audio

### Admin
- `GET /api/admin/stats` - Estadísticas (solo admin)
- `GET /api/admin/moderation` - Contenido para moderar (solo admin)

## Solucionar problemas

### "ModuleNotFoundError: No module named 'supabase'"
```bash
pip install -r requirements.txt
```

### "Connection refused" en base de datos
Verificar que SUPABASE_URL y SUPABASE_KEY estén correctos en .env

### Puerto 8000 en uso
```bash
python -m uvicorn main:app --port 8001
```

## Notas

- El servidor en desarrollo reinicia automáticamente con cambios de código
- Los logs aparecen en la consola
- Para producción, cambiar `ENV=development` a `ENV=production` en .env
