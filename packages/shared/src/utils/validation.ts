export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 100;
};

export const validateCoordinates = (latitude: number, longitude: number): boolean => {
  return latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
};

export const validateFileSize = (file: File, maxSizeMB: number = 10): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

export const validateImageFile = (file: File): boolean => {
  const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  return validImageTypes.includes(file.type);
};

export const validateAudioFile = (file: File): boolean => {
  const validAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm'];
  return validAudioTypes.includes(file.type);
};

export const validateSightingData = (data: {
  bird_id?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
}): string[] => {
  const errors: string[] = [];

  if (!data.bird_id) errors.push('Bird ID is required');
  if (data.latitude === undefined || data.longitude === undefined) {
    errors.push('Location is required');
  } else if (!validateCoordinates(data.latitude, data.longitude)) {
    errors.push('Invalid coordinates');
  }
  if (data.description && data.description.length > 1000) {
    errors.push('Description too long (max 1000 characters)');
  }

  return errors;
};
