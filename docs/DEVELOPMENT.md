# Guía de Desarrollo - Sisio Interculturaap

## Requisitos Previos

- Node.js 18+ 
- pnpm 9+ (`npm install -g pnpm`)
- Python 3.9+ (para backend)
- PostgreSQL 14+ (para base de datos)

## Setup Inicial

```bash
# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp packages/web/.env.example packages/web/.env.local
```

## Estructura del Proyecto

```
.
├── packages/
│   ├── shared/          # Código compartido (hooks, tipos, servicios)
│   ├── web/             # Aplicación web (React + Vite)
│   └── mobile/          # Aplicación móvil (React Native + Expo)
├── backend/             # API FastAPI
├── docs/                # Documentación
└── README.md
```

## Desarrollo Web

```bash
# Iniciar servidor de desarrollo
pnpm dev --filter=web

# Build de producción
pnpm build --filter=web

# Ver resultado de build
pnpm preview --filter=web
```

**URL:** http://localhost:5173

### Características Principales

- **Inicio de Sesión**: Página de login y onboarding
- **Upload Multimedia**: Foto y audio con identificación IA
- **Mapa Interactivo**: Visualización de avistamientos
- **Perfil**: Gestión de perfil y estadísticas
- **Configuración**: Tema, idioma, exportar datos
- **Admin Panel**: Dashboard de moderación (solo admins)
- **PWA**: Funciona offline con service-worker

### Hooks Disponibles

```typescript
import { 
  useAuth,              // Autenticación y sesión
  useSightings,         // Gestión de avistamientos
  useBird,              // Identificación de aves
  useOffline,           // Estado online/offline
  useOfflineSync,       // Cola de sincronización
  useAR                 // Visor AR con Babylon.js
} from '@sisio/shared';
```

## Desarrollo Backend

```bash
cd backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Correr migraciones
alembic upgrade head

# Iniciar servidor
uvicorn main:app --reload
```

**URL:** http://localhost:8000
**Docs:** http://localhost:8000/docs

### Routers Principales

- `/api/auth` - Autenticación y sesión
- `/api/birds` - Catálogo de aves
- `/api/sightings` - Avistamientos y observaciones
- `/api/comments` - Comentarios y comunidad
- `/api/admin` - Panel administrativo
- `/api/photos` - Gestión de fotos
- `/api/audio` - Procesamiento de audio

## Testing

```bash
# Unit tests
pnpm test --filter=web

# Integration tests
pnpm test:integration --filter=web

# E2E tests con Playwright
pnpm test:e2e --filter=web
```

## Build & Deploy

```bash
# Build todas las apps
pnpm build

# Verificar tamaño de bundles
pnpm size --filter=web

# Análisis de performance
pnpm analyze --filter=web
```

## Variables de Entorno

### Web (.env.local)
```
VITE_API_URL=http://localhost:8000
VITE_API_TIMEOUT=30000
VITE_DEBUG=false
```

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost/sisio
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
```

## Troubleshooting

### Build fallos
```bash
pnpm install --force
pnpm clean
pnpm build
```

### Problemas de Base de Datos
```bash
# Reset de migraciones
alembic downgrade base
alembic upgrade head

# Recrear base de datos
dropdb sisio
createdb sisio
alembic upgrade head
```

### Caché de navegador
```bash
# Limpiar todas las cachés
# En Developer Tools > Application > Clear site data
```

## Contribuyendo

1. Crea una rama: `git checkout -b feature/nombre`
2. Haz cambios y test
3. Commit: `git commit -m "feat: descripción"`
4. Push: `git push origin feature/nombre`
5. PR a `main`

## Arquitectura

### Frontend (Web)
- **Framework**: React 18 + TypeScript
- **Bundler**: Vite
- **UI**: Material-UI v5
- **Routing**: React Router v6
- **Estado**: Zustand + React Query
- **Offline**: Service Worker + IndexedDB

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL
- **Auth**: JWT (PyJWT)
- **ORM**: SQLAlchemy
- **Validation**: Pydantic

### Mobile
- **Framework**: React Native (Expo)
- **Navigation**: React Navigation
- **Estado**: Zustand
- **UI**: React Native Paper
- **AR**: Babylon.js

## Performance Targets

- Lighthouse: 90+ (todas las métricas)
- Bundle size: < 500KB (gzipped)
- API response: < 200ms
- TTL (First Contentful Paint): < 1.5s
- Offline availability: 100%

## Roadmap

- [ ] Fase 1: Autenticación ✅
- [ ] Fase 2: Upload de multimedia ✅
- [ ] Fase 3: Identificación IA ✅
- [ ] Fase 4: Interfaz web ✅
- [ ] Fase 5: Soporte offline ✅
- [ ] Fase 6: Testing completo
- [ ] Fase 7: Optimización
- [ ] Fase 8: Deployment

## Recursos

- [API Documentation](./API.md)
- [Database Schema](./DATABASE.md)
- [Architecture Design](./ARCHITECTURE.md)
