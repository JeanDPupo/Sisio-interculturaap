export interface AppError {
    code: string;
    message: string;
    details?: unknown;
}
export declare const handleApiError: (error: unknown) => AppError;
export declare const getErrorMessage: (error: AppError, locale?: string) => string;
//# sourceMappingURL=errorHandler.d.ts.map