# 🦅 Sisio Interculturaap - Preservación del Conocimiento Ancestral

> Aplicación multiplataforma (React Native + React Web PWA) para identificar aves y preservar el conocimiento ancestral de las comunidades indígenas de la Sierra Nevada de Santa Marta, Colombia.

---

## 📖 Descripción del Proyecto

**Sisio interculturaap** es una aplicación moderna que permite a niños y adultos de comunidades indígenas:

- 🦜 **Identificar aves** por foto o sonido usando IA
- 📚 **Aprender el conocimiento ancestral** sobre cada ave (historias, refranes, roles cosmovisionarios)
- 📍 **Registrar avistamientos geolocalizados** para preservar información del ecosistema
- 👥 **Conectar con la comunidad** mediante comentarios e intercambio de observaciones
- 🗺️ **Visualizar en mapas** todos los avistamientos registrados

### Valores Principales

- **Conocimiento Ancestral Primario**: Las historias, significados y roles cosmovisionarios van primero
- **Información Científica Secundaria**: La ornitología complementa, no reemplaza
- **Acceso Offline**: Funciona en zonas rurales sin conexión confiable
- **Preservación**: Cada interacción se registra para futuro análisis ecológico

---

## 🛠️ Stack Tecnológico

### Frontend
| Tecnología | Plataforma |
|---|---|
| **React Native** | iOS, Android |
| **React + Vite** | Web (PWA) |
| **TypeScript** | Lenguaje base |
| **Zustand** | State management |
| **React Query** | API caching |
| **Babylon.js** | Realidad Aumentada (AR) |

### Backend
| Tecnología | Rol |
|---|---|
| **FastAPI (Python)** | API REST principal |
| **Supabase** | PostgreSQL + Auth + Storage |

### IA & APIs Externas
| Servicio | Función |
|---|---|
| **BirdNET** | Identificación por audio |
| **iNaturalist API** | Identificación por foto |
| **Google Geolocation** | Ubicación y reverse geocoding |

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT TIER                              │
├──────────────────────────┬──────────────────────────────────┤
│   React Native App       │      React Web (PWA)             │
│   (iOS/Android)          │      Código Compartido           │
└──────────────┬───────────┴─────────────────┬────────────────┘
               │                             │
               └────────────┬────────────────┘
                            │
                  ┌─────────▼────────┐
                  │  Shared Layer    │
                  │ ─────────────────│
                  │ • Types (TS)     │
                  │ • Stores         │
                  │ • Services       │
                  │ • Utils          │
                  │ • Babylon.js AR  │
                  └─────────┬────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
   ┌────▼──────┐   ┌────────▼──────┐  ┌────────▼─────┐
   │  FastAPI  │   │   Supabase    │  │   External   │
   │  Backend  │   │   (Auth, DB)  │  │   APIs       │
   └───────────┘   └───────────────┘  └──────────────┘
```

---

## 📁 Estructura del Proyecto

```
sisio-interculturaap/
├── packages/
│   ├── shared/              # Código compartido (types, stores, services)
│   │   ├── src/
│   │   │   ├── types/       # TypeScript interfaces
│   │   │   ├── store/       # Zustand stores
│   │   │   ├── services/    # API client, auth, offline
│   │   │   ├── hooks/       # Custom React hooks
│   │   │   ├── utils/       # Validation, formatting, etc
│   │   │   └── babylon/     # AR scenes (Babylon.js)
│   │   └── package.json
│   │
│   ├── mobile/              # React Native app (Expo)
│   │   ├── src/
│   │   │   ├── screens/     # Pantallas (Home, Photo, Audio, etc)
│   │   │   ├── components/  # Componentes reutilizables
│   │   │   └── navigation/  # React Navigation setup
│   │   ├── app.json
│   │   └── package.json
│   │
│   └── web/                 # React web app (Vite)
│       ├── src/
│       │   ├── pages/       # Páginas (Home, Sightings, Map, etc)
│       │   ├── components/  # Componentes Material-UI
│       │   └── layouts/     # Layout wrappers
│       ├── public/
│       │   ├── manifest.json # PWA manifest
│       │   ├── index.html
│       │   └── logo.png
│       ├── vite.config.ts
│       └── package.json
│
├── backend/                 # FastAPI backend
│   ├── main_py.py           # Entry point
│   ├── routers/
│   │   ├── auth.py          # Auth endpoints
│   │   ├── birds.py         # Bird identification
│   │   ├── sightings.py     # Sightings CRUD
│   │   ├── comments.py      # Comments on sightings
│   │   └── admin.py         # Admin panel
│   ├── services/
│   │   ├── auth_service.py  # JWT, password hashing
│   │   ├── birdnet.py       # BirdNET integration
│   │   ├── inaturalist.py   # iNaturalist integration
│   │   ├── geolocation_service.py  # Geoloc & GIS
│   │   └── supabase_service.py
│   ├── models/              # Pydantic models
│   ├── middleware/          # Auth middleware
│   ├── supabase_schema.sql  # Database schema
│   └── requirements.txt
│
├── pnpm-workspace.yaml      # Monorepo config
├── tsconfig.json            # TypeScript root config
└── README.md
```

---

## 🚀 Quick Start

### Requisitos
- Node.js 18+, pnpm 8+
- Python 3.10+, pip
- Git

### Instalación

```bash
# 1. Clone
git clone <repo>
cd sisio-interculturaap

# 2. Dependencias
pnpm install

# 3. Backend setup
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edita .env con credenciales Supabase, APIs

# 4. Database
# Copia contenido de supabase_schema.sql a:
# https://supabase.com/dashboard/project/_/sql
```

### Ejecutar

```bash
# Terminal 1: Backend
cd backend && uvicorn main_py:app --reload

# Terminal 2: Web
pnpm --filter @sisio/web dev
# -> http://localhost:3000

# Terminal 3: Mobile
pnpm --filter @sisio/mobile dev
# -> Sigue instrucciones Expo
```

---

## 📋 Features

### 🦜 Identificación
- **Foto**: iNaturalist API
- **Audio**: BirdNET
- Confianza + Conocimiento ancestral

### 📍 Geolocalización
- Avistamientos con ubicación exacta
- Mapa de avistamientos (usuario + admin)
- Verificación: "¿esta ave pertenece acá?"

### 📚 Conocimiento Ancestral (Prioritario)
- Historias y leyendas
- Refranes y sabiduría
- Roles en la cosmovisión
- Nombres en lengua nativa (Kogui, Wiwa, Arhuaco)

### 📱 Offline-First
- Captura N fotos + M audios sin conexión
- Sincronización automática al conectar
- IndexedDB para almacenamiento local

### 👥 Comunidad
- Comentarios en avistamientos
- Agrupa por día/ave/ubicación
- Solo usuarios autenticados pueden comentar

### ⚙️ Configuración
- Temas (light/dark)
- Idioma seleccionable
- Perfil completable (opcional)

---

## 📊 Fase de Implementación

### ✅ Phase 1: Backend (Completado)
- Supabase schema expandido
- 6 routers funcionales (auth, birds, sightings, comments, admin)
- Servicios de auth, geoloc, IA integration

### ✅ Phase 2: Shared Layer (Completado)
- TypeScript types completos
- Zustand stores (auth, bird, sighting, offline)
- API client con Axios + React Query
- Utils de validación, formateo, error handling

### ✅ Phase 3: Mobile (En progreso)
- [x] Estructura con Expo + React Navigation
- [ ] Pantallas: Home, Photo, Audio, Result, Sightings, Map, Profile
- [ ] AR viewer (Babylon.js)
- [ ] Offline sync

### ✅ Phase 4: Web (En progreso)
- [x] Vite + React Router + Material-UI setup
- [ ] Páginas: Home, Upload, Result, Sightings, Map, Profile, Admin
- [ ] PWA manifest + Service Worker
- [ ] Offline sync

### ⏳ Phase 5: AR (Babylon.js)
- 3D bird models con puntos interactivos
- Cross-platform (mobile + web)
- Fallback para dispositivos sin AR

### ⏳ Phase 6: Testing & Optimization
- Unit tests (Vitest)
- E2E tests (Detox, Playwright)
- Performance, security, accessibility

---

## 🔐 Seguridad

- JWT tokens + refresh tokens
- Row-Level Security (RLS) en Supabase
- CORS configurado
- No secrets en frontend

---

## 📦 Deployment

```bash
# Web (Vercel, Netlify, Firebase)
pnpm --filter @sisio/web build

# Mobile (Expo EAS, App Store, Play Store)
pnpm --filter @sisio/mobile build:ios
pnpm --filter @sisio/mobile build:android

# Backend (Render, Railway, AWS)
# Ver backend/README.md
```

---

## 🤝 Contribuir

1. Fork
2. Feature branch: `git checkout -b feature/xyz`
3. Commit: `git commit -m 'Add xyz'`
4. Push: `git push origin feature/xyz`
5. Pull Request

---

## 📝 Licencia

MIT License - Libre para uso académico y comunitario.

---

## 🙏 Agradecimientos

A las comunidades indígenas Kogui, Wiwa y Arhuaco de la Sierra Nevada de Santa Marta por compartir su conocimiento invaluable.
