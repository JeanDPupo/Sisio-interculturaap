import { AxiosError } from 'axios';

export interface AppError {
  code: string;
  message: string;
  details?: unknown;
}

export const handleApiError = (error: unknown): AppError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;

    if (axiosError.response?.status === 404) {
      return {
        code: 'NOT_FOUND',
        message: 'Recurso no encontrado',
        details: axiosError.response.data,
      };
    }

    if (axiosError.response?.status === 401) {
      return {
        code: 'UNAUTHORIZED',
        message: 'No autorizado. Por favor inicia sesión.',
        details: axiosError.response.data,
      };
    }

    if (axiosError.response?.status === 403) {
      return {
        code: 'FORBIDDEN',
        message: 'No tienes permiso para acceder a este recurso',
        details: axiosError.response.data,
      };
    }

    if (axiosError.response?.status === 409) {
      return {
        code: 'CONFLICT',
        message: 'El recurso ya existe o hay un conflicto',
        details: axiosError.response.data,
      };
    }

    if (axiosError.response?.status === 500) {
      return {
        code: 'SERVER_ERROR',
        message: 'Error del servidor. Por favor intenta más tarde.',
        details: axiosError.response.data,
      };
    }

    if (axiosError.code === 'ECONNABORTED') {
      return {
        code: 'TIMEOUT',
        message: 'La solicitud tardó demasiado. Por favor intenta de nuevo.',
      };
    }

    if (!navigator.onLine) {
      return {
        code: 'OFFLINE',
        message: 'No hay conexión a Internet. Por favor verifica tu conexión.',
      };
    }

    return {
      code: 'NETWORK_ERROR',
      message: axiosError.message || 'Error de red',
      details: axiosError.response?.data,
    };
  }

  if (error instanceof Error) {
    return {
      code: 'UNKNOWN_ERROR',
      message: error.message,
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: 'Error desconocido',
  };
};

export const getErrorMessage = (error: AppError, locale: string = 'es'): string => {
  // Map error codes to user-friendly messages
  const messages: Record<string, Record<string, string>> = {
    es: {
      NOT_FOUND: 'El recurso que buscas no existe',
      UNAUTHORIZED: 'Debes iniciar sesión para continuar',
      FORBIDDEN: 'No tienes permiso para hacer esto',
      CONFLICT: 'Este recurso ya existe',
      SERVER_ERROR: 'Algo salió mal en el servidor',
      OFFLINE: 'Parece que estás sin conexión',
      NETWORK_ERROR: 'Problema de conexión de red',
      TIMEOUT: 'La operación tardó demasiado',
      UNKNOWN_ERROR: 'Ocurrió un error inesperado',
    },
    en: {
      NOT_FOUND: 'Resource not found',
      UNAUTHORIZED: 'You must log in to continue',
      FORBIDDEN: 'You do not have permission to do this',
      CONFLICT: 'This resource already exists',
      SERVER_ERROR: 'Something went wrong on the server',
      OFFLINE: 'You appear to be offline',
      NETWORK_ERROR: 'Network connection problem',
      TIMEOUT: 'The operation took too long',
      UNKNOWN_ERROR: 'An unexpected error occurred',
    },
  };

  return messages[locale]?.[error.code] || error.message;
};

// Import axios for type checking
import axios from 'axios';
