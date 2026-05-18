-- Supabase Schema for Sisio Interculturaap
-- Ejecutar en el SQL Editor de Supabase: https://supabase.com/dashboard/project/_/sql

-- Tabla de usuarios
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE,
    name TEXT NOT NULL,
    profile_picture TEXT,
    bio TEXT,
    language TEXT DEFAULT 'es',
    theme_preference TEXT DEFAULT 'light',
    is_admin BOOLEAN DEFAULT false,
    is_guest BOOLEAN DEFAULT false,
    guest_id UUID UNIQUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de aves (mejorada con más campos ancestrales)
CREATE TABLE aves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_cientifico TEXT NOT NULL UNIQUE,
    nombre_espanol TEXT,
    nombre_nativo TEXT,
    lengua TEXT,
    significado_ancestral TEXT,
    rol_cosmovision TEXT,
    historias_ancestrales JSONB DEFAULT '[]',
    refranes JSONB DEFAULT '[]',
    comportamientos TEXT,
    habitat TEXT,
    zona_geografica TEXT,
    es_migratoria BOOLEAN DEFAULT false,
    periodo_migracion TEXT,
    imagen_url TEXT,
    audio_url TEXT,
    ecosistema_riesgo TEXT DEFAULT 'bajo',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de comunidades indígenas
CREATE TABLE communities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    language TEXT,
    territory_bounds JSONB,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de avistamientos (sightings)
CREATE TABLE sightings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    bird_id UUID REFERENCES aves(id) ON DELETE CASCADE,
    location JSONB NOT NULL,
    photo_url TEXT,
    audio_url TEXT,
    description TEXT,
    confidence FLOAT,
    ecosystem_risk TEXT,
    location_match BOOLEAN,
    is_approved BOOLEAN DEFAULT false,
    timestamp TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de comentarios
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sighting_id UUID REFERENCES sightings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    text TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de logs administrativos
CREATE TABLE admin_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action TEXT NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    target_id UUID,
    details JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de configuración de aplicación
CREATE TABLE app_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key TEXT NOT NULL UNIQUE,
    setting_value TEXT,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear índices para optimización
CREATE INDEX idx_aves_nombre_cientifico ON aves (nombre_cientifico);
CREATE INDEX idx_sightings_user_id ON sightings (user_id);
CREATE INDEX idx_sightings_bird_id ON sightings (bird_id);
CREATE INDEX idx_sightings_timestamp ON sightings (timestamp);
CREATE INDEX idx_comments_sighting_id ON comments (sighting_id);
CREATE INDEX idx_comments_user_id ON comments (user_id);
CREATE INDEX idx_users_email ON users (email);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sightings ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only read their own data
CREATE POLICY "users_select_self" ON users FOR SELECT
  USING (auth.uid() = id OR is_guest = true);

-- RLS Policy: Sightings visible to public (comments private)
CREATE POLICY "sightings_select_all" ON sightings FOR SELECT
  USING (is_approved = true);

-- RLS Policy: Users can insert their own sightings
CREATE POLICY "sightings_insert_own" ON sightings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Comments visible on approved sightings
CREATE POLICY "comments_select_approved" ON comments FOR SELECT
  USING (EXISTS(SELECT 1 FROM sightings WHERE sightings.id = comments.sighting_id AND sightings.is_approved = true));

-- RLS Policy: Authenticated users can insert comments
CREATE POLICY "comments_insert_auth" ON comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);