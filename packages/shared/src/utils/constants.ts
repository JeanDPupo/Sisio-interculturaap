export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

export const LANGUAGES = {
  ES: 'es',
  EN: 'en',
  KOGUI: 'kogui',
  WIWA: 'wiwa',
  ARHUACO: 'arhuaco',
} as const;

export const ECOSYSTEM_RISK_LEVELS = {
  BAJO: 'bajo',
  MEDIO: 'medio',
  ALTO: 'alto',
} as const;

export const ECOSYSTEM_RISK_COLORS = {
  bajo: '#4CAF50',
  medio: '#FFC107',
  alto: '#F44336',
} as const;

export const SORTINGS = {
  RECENT: 'recent',
  POPULAR: 'popular',
  ALPHABETICAL: 'alphabetical',
} as const;

export const FILTER_GROUPBY = {
  DAY: 'day',
  BIRD: 'bird',
  LOCATION: 'location',
} as const;

export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: 'sisio_auth_token',
  REFRESH_TOKEN: 'sisio_refresh_token',
  USER: 'sisio_user',
  THEME: 'sisio_theme',
  LANGUAGE: 'sisio_language',
} as const;
