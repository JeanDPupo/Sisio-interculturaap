-- Users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE,
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    password_hash VARCHAR(255),
    profile_picture VARCHAR(500),
    language VARCHAR(10) DEFAULT 'es',
    theme_preference VARCHAR(10) DEFAULT 'light',
    is_admin BOOLEAN DEFAULT false,
    is_guest BOOLEAN DEFAULT false,
    guest_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Birds table
CREATE TABLE IF NOT EXISTS public.aves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_espanol VARCHAR(255) NOT NULL,
    nombre_cientifico VARCHAR(255),
    descripcion TEXT,
    ecosystem_riesgo VARCHAR(50),
    imagen_url VARCHAR(500),
    habitat TEXT,
    dieta TEXT,
    conocimiento_ancestral TEXT,
    zona_geografica VARCHAR(255),
    es_migratoria BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sightings table
CREATE TABLE IF NOT EXISTS public.sightings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    bird_id UUID REFERENCES public.aves(id) ON DELETE CASCADE,
    location JSONB,
    photo_url VARCHAR(500),
    audio_url VARCHAR(500),
    description TEXT,
    confidence FLOAT,
    ecosystem_risk VARCHAR(50),
    location_match BOOLEAN,
    is_approved BOOLEAN DEFAULT false,
    timestamp TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments table
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sighting_id UUID REFERENCES public.sightings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin logs table
CREATE TABLE IF NOT EXISTS public.admin_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    target_id UUID,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON public.users(is_admin);
CREATE INDEX IF NOT EXISTS idx_sightings_user_id ON public.sightings(user_id);
CREATE INDEX IF NOT EXISTS idx_sightings_bird_id ON public.sightings(bird_id);
CREATE INDEX IF NOT EXISTS idx_sightings_is_approved ON public.sightings(is_approved);
CREATE INDEX IF NOT EXISTS idx_sightings_timestamp ON public.sightings(timestamp);
CREATE INDEX IF NOT EXISTS idx_comments_sighting_id ON public.comments(sighting_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_user_id ON public.admin_logs(user_id);

-- Add seed data with some birds
INSERT INTO public.aves (nombre_espanol, nombre_cientifico, descripcion, ecosystem_riesgo, habitat, dieta, conocimiento_ancestral, zona_geografica)
VALUES
    ('Águila Real', 'Aquila chrysaetos', 'Águila grande con envergadura de 2 metros', 'alto', 'Montañas y áreas abiertas', 'Caza pequeños mamíferos', 'El águila representa la conexión con los dioses', 'Andes'),
    ('Loro Verde', 'Amazona amazonica', 'Loro de color verde brillante', 'medio', 'Selva tropical', 'Frutas y semillas', 'Símbolo de la comunicación y la sabiduría ancestral', 'Amazonía'),
    ('Flamenco Andino', 'Phoenicoparrus andinus', 'Flamenco de color rosado', 'alto', 'Lagunas altoandinas', 'Algas y diatomeas', 'Especie sagrada en culturas andinas', 'Altiplano'),
    ('Colibrí de Garganta Roja', 'Archilochus colubris', 'Pequeño colibrí con garganta roja', 'bajo', 'Jardines y bosques', 'Néctar de flores', 'Representan la energía vital y la renovación', 'Neotropical'),
    ('Tucán Toco', 'Ramphastos toco', 'Tucán grande con pico amarillo', 'medio', 'Selva tropical', 'Frutas principalmente', 'Considerado guardián de los bosques en tradiciones indígenas', 'Amazonía')
ON CONFLICT DO NOTHING;
