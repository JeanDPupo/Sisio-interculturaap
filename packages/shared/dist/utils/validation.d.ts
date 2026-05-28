export declare const validateEmail: (email: string) => boolean;
export declare const validatePassword: (password: string) => boolean;
export declare const validateName: (name: string) => boolean;
export declare const validateCoordinates: (latitude: number, longitude: number) => boolean;
export declare const validateFileSize: (file: File, maxSizeMB?: number) => boolean;
export declare const validateImageFile: (file: File) => boolean;
export declare const validateAudioFile: (file: File) => boolean;
export declare const validateSightingData: (data: {
    bird_id?: string;
    latitude?: number;
    longitude?: number;
    description?: string;
}) => string[];
//# sourceMappingURL=validation.d.ts.map