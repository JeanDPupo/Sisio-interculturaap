function safeEnvVar(name: string, fallback: string): string {
  try {
    if (typeof process !== 'undefined' && process.env && process.env[name]) {
      return process.env[name];
    }
  } catch {}
  return fallback;
}

export const API_BASE_URL = safeEnvVar('EXPO_PUBLIC_API_URL', 'http://localhost:8000/api');
