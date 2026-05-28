export { API_BASE_URL } from '../utils/env';
export declare const API_TIMEOUT = 30000;
export declare const CACHE_DURATION: {
    BIRDS: number;
    SIGHTINGS: number;
    USER: number;
    COMMENTS: number;
};
export declare const OFFLINE_CONFIG: {
    MAX_QUEUE_SIZE: number;
    MAX_RETRIES: number;
    RETRY_DELAY: number;
};
export declare const STORAGE_KEYS: {
    AUTH_TOKEN: string;
    REFRESH_TOKEN: string;
    USER: string;
    SIGHTINGS: string;
    BIRDS: string;
};
export declare const ERROR_MESSAGES: {
    NETWORK_ERROR: string;
    TIMEOUT: string;
    UNAUTHORIZED: string;
    FORBIDDEN: string;
    NOT_FOUND: string;
    SERVER_ERROR: string;
    UNKNOWN: string;
};
export declare const FEATURES: {
    OFFLINE_SUPPORT: boolean;
    PWA_ENABLED: boolean;
    AR_ENABLED: boolean;
    SHARING_ENABLED: boolean;
};
export declare const VALIDATION: {
    PASSWORD_MIN_LENGTH: number;
    NAME_MIN_LENGTH: number;
    BIO_MAX_LENGTH: number;
    IMAGE_MAX_SIZE: number;
    AUDIO_MAX_SIZE: number;
};
//# sourceMappingURL=index.d.ts.map