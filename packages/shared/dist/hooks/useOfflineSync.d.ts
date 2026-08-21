interface QueuedRequest {
    id: string;
    method: 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    url: string;
    data?: any;
    timestamp: number;
    retries: number;
}
export declare const useOfflineSync: () => {
    addToQueue: (method: string, url: string, data?: any) => Promise<string>;
    getQueuedRequests: () => Promise<QueuedRequest[]>;
    removeFromQueue: (id: string) => Promise<void>;
    processQueue: (apiService: any) => Promise<number | undefined>;
};
export {};
//# sourceMappingURL=useOfflineSync.d.ts.map