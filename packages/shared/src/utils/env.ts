function safeEnvVar(name: string, fallback: string): string {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[name]) {
      return import.meta.env[name];
    }
  } catch {}
  try {
    if (typeof process !== 'undefined' && process.env && process.env[name]) {
      return process.env[name];
    }
  } catch {}
  return fallback;
}

export const API_BASE_URL = safeEnvVar('VITE_API_URL', 'http://localhost:8000/api');
