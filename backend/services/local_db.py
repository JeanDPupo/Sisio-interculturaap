"""
Esquema SQLite para Sisio (mismo diseño que supabase_schema.sql).
Se ejecuta automáticamente al arrancar el backend si la BD no existe.
"""
import sqlite3
import os
from datetime import datetime, timezone

from .local_client import DB_PATH

SCHEMA = """
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    name TEXT NOT NULL,
    profile_picture TEXT,
    bio TEXT,
    password_hash TEXT,
    language TEXT DEFAULT 'es',
    theme_preference TEXT DEFAULT 'light',
    is_admin INTEGER DEFAULT 0,
    is_guest INTEGER DEFAULT 0,
    guest_id TEXT UNIQUE,
    created_at TEXT,
    updated_at TEXT
);

CREATE TABLE IF NOT EXISTS aves (
    id TEXT PRIMARY KEY,
    nombre_cientifico TEXT NOT NULL UNIQUE,
    nombre_espanol TEXT,
    nombre_nativo TEXT,
    lengua TEXT,
    significado_ancestral TEXT,
    rol_cosmovision TEXT,
    historias_ancestrales TEXT DEFAULT '[]',
    refranes TEXT DEFAULT '[]',
    comportamientos TEXT,
    habitat TEXT,
    zona_geografica TEXT,
    es_migratoria INTEGER DEFAULT 0,
    periodo_migracion TEXT,
    imagen_url TEXT,
    audio_url TEXT,
    ecosistema_riesgo TEXT DEFAULT 'bajo',
    created_at TEXT,
    updated_at TEXT
);

CREATE TABLE IF NOT EXISTS communities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    language TEXT,
    territory_bounds TEXT,
    description TEXT,
    created_at TEXT
);

CREATE TABLE IF NOT EXISTS sightings (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    bird_id TEXT,
    location TEXT NOT NULL,
    photo_url TEXT,
    audio_url TEXT,
    description TEXT,
    confidence REAL,
    ecosystem_risk TEXT,
    location_match INTEGER,
    is_approved INTEGER DEFAULT 0,
    timestamp TEXT,
    created_at TEXT,
    updated_at TEXT
);

CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    sighting_id TEXT,
    user_id TEXT,
    text TEXT NOT NULL,
    is_approved INTEGER DEFAULT 1,
    created_at TEXT,
    updated_at TEXT
);

CREATE TABLE IF NOT EXISTS admin_logs (
    id TEXT PRIMARY KEY,
    action TEXT NOT NULL,
    user_id TEXT,
    target_id TEXT,
    details TEXT,
    created_at TEXT
);

CREATE TABLE IF NOT EXISTS app_settings (
    id TEXT PRIMARY KEY,
    setting_key TEXT NOT NULL UNIQUE,
    setting_value TEXT,
    updated_at TEXT
);
"""

# Aves seed (mismas que muestra la app en HomeScreen)
SEED_AVES = [
    {
        "id": "seed-aguila-real",
        "nombre_cientifico": "Aquila chrysaetos",
        "nombre_espanol": "Águila Real",
        "nombre_nativo": "Zhigoneshi",
        "lengua": "Kogui",
        "significado_ancestral": "Mensajera del sol, protectora de los picos altos.",
        "rol_cosmovision": "Guardián del mundo de arriba; su vuelo anuncia cambios.",
        "habitat": "Páramos y bosques altoandinos de la Sierra Nevada.",
        "es_migratoria": 0,
        "ecosistema_riesgo": "medio",
        "historias_ancestrales": "[]",
        "refranes": "[]",
    },
    {
        "id": "seed-loro-verde",
        "nombre_cientifico": "Amazona amazonica",
        "nombre_espanol": "Loro Verde",
        "nombre_nativo": "Kuibi",
        "lengua": "Arhuaco",
        "significado_ancestral": "La palabra que repite la memoria del bosque.",
        "rol_cosmovision": "Comunicador entre los humanos y los árboles.",
        "habitat": "Selvas y bosques de galería.",
        "es_migratoria": 0,
        "ecosistema_riesgo": "bajo",
        "historias_ancestrales": "[]",
        "refranes": "[]",
    },
    {
        "id": "seed-tucan-toco",
        "nombre_cientifico": "Ramphastos toco",
        "nombre_espanol": "Tucán Toco",
        "nombre_nativo": "Seynekun",
        "lengua": "Wiwa",
        "significado_ancestral": "Pico que siembra semillas de la abundancia.",
        "rol_cosmovision": "Jardinero del monte, sembrador de frutos.",
        "habitat": "Bosques húmedos tropicales.",
        "es_migratoria": 0,
        "ecosistema_riesgo": "bajo",
        "historias_ancestrales": "[]",
        "refranes": "[]",
    },
    {
        "id": "seed-colibri",
        "nombre_cientifico": "Archilochus colubris",
        "nombre_espanol": "Colibrí",
        "nombre_nativo": "Gunkuarua",
        "lengua": "Arhuaco",
        "significado_ancestral": "El corazón que no se detiene, la gota de néctar.",
        "rol_cosmovision": "Polinizador sagrado, se dice que acompaña al alma.",
        "habitat": "Jardines, cafetales y bosques montanos.",
        "es_migratoria": 1,
        "periodo_migracion": "Marzo - Octubre",
        "ecosistema_riesgo": "bajo",
        "historias_ancestrales": "[]",
        "refranes": "[]",
    },
    {
        "id": "seed-mochilero",
        "nombre_cientifico": "Icterus nigrogularis",
        "nombre_espanol": "Turpial Amarillo",
        "nombre_nativo": "Wuirru",
        "lengua": "Wiwa",
        "significado_ancestral": "El sol de la mañana que canta.",
        "rol_cosmovision": "Anunciador del amanecer y las buenas cosechas.",
        "habitat": "Zonas abiertas y bosques secos.",
        "es_migratoria": 0,
        "ecosistema_riesgo": "bajo",
        "historias_ancestrales": "[]",
        "refranes": "[]",
    },
]


def init_db():
    """Crea las tablas y siembra datos base si aún no hay aves."""
    conn = sqlite3.connect(DB_PATH)
    conn.executescript(SCHEMA)
    conn.commit()

    now = datetime.now(timezone.utc).isoformat()
    try:
        count = conn.execute('SELECT COUNT(*) FROM "aves"').fetchone()[0]
    except sqlite3.OperationalError:
        conn.executescript(SCHEMA)
        conn.commit()
        count = 0

    if count == 0:
        for ave in SEED_AVES:
            data = dict(ave)
            data.setdefault("created_at", now)
            data.setdefault("updated_at", now)
            cols = list(data.keys())
            col_sql = ", ".join(f'"{c}"' for c in cols)
            placeholders = ", ".join("?" for _ in cols)
            conn.execute(
                f'INSERT OR IGNORE INTO "aves" ({col_sql}) VALUES ({placeholders})',
                [data[c] for c in cols],
            )
        conn.commit()
    conn.close()


def seed_if_empty():
    """Inserta las aves demo solo si la tabla aves está vacía."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        count = conn.execute('SELECT COUNT(*) FROM "aves"').fetchone()[0]
    except sqlite3.OperationalError:
        conn.executescript(SCHEMA)
        conn.commit()
        count = 0
    if count == 0:
        now = datetime.now(timezone.utc).isoformat()
        for ave in SEED_AVES:
            data = dict(ave)
            data.setdefault("created_at", now)
            data.setdefault("updated_at", now)
            cols = list(data.keys())
            col_sql = ", ".join(f'"{c}"' for c in cols)
            placeholders = ", ".join("?" for _ in cols)
            conn.execute(
                f'INSERT OR IGNORE INTO "aves" ({col_sql}) VALUES ({placeholders})',
                [data[c] for c in cols],
            )
        conn.commit()
    conn.close()
