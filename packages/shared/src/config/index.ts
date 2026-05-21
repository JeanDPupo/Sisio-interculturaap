// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
export const API_TIMEOUT = 30000; // 30 seconds

// Cache Configuration
export const CACHE_DURATION = {
  BIRDS: 1 * 60 * 60 * 1000, // 1 hour
  SIGHTINGS: 5 * 60 * 1000, // 5 minutes
  USER: 24 * 60 * 60 * 1000, // 24 hours
  COMMENTS: 5 * 60 * 1000, // 5 minutes
};

// Offline Configuration
export const OFFLINE_CONFIG = {
  MAX_QUEUE_SIZE: 100,
  MAX_RETRIES: 3,
  RETRY_DELAY: 5000, // 5 seconds
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'sisio:auth:token',
  REFRESH_TOKEN: 'sisio:auth:refresh',
  USER: 'sisio:user',
  SIGHTINGS: 'sisio:sightings',
  BIRDS: 'sisio:birds',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
  TIMEOUT: 'Tiempo de espera agotado. Intenta de nuevo.',
  UNAUTHORIZED: 'Sesión expirada. Por favor inicia sesión.',
  FORBIDDEN: 'No tienes permisos para esta acción.',
  NOT_FOUND: 'El recurso no existe.',
  SERVER_ERROR: 'Error del servidor. Intenta más tarde.',
  UNKNOWN: 'Ocurrió un error desconocido.',
};

// App Features
export const FEATURES = {
  OFFLINE_SUPPORT: true,
  PWA_ENABLED: true,
  AR_ENABLED: true,
  SHARING_ENABLED: true,
};

// Validation Rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  BIO_MAX_LENGTH: 500,
  IMAGE_MAX_SIZE: 10 * 1024 * 1024, // 10MB
  AUDIO_MAX_SIZE: 50 * 1024 * 1024, // 50MB
};
