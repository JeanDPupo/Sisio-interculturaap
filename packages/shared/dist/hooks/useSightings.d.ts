import { Sighting } from '../types';
export declare const useSightings: () => {
    sightings: Sighting[];
    loading: boolean;
    error: string | null;
    getSightings: (userId?: string, limit?: number, offset?: number) => Promise<any>;
    getSightingById: (id: string) => Promise<any>;
    getSightingsForMap: (bounds?: string) => Promise<any>;
    createSighting: (sightingData: Partial<Sighting>) => Promise<any>;
    updateSighting: (id: string, updates: Partial<Sighting>) => Promise<any>;
    deleteSighting: (id: string) => Promise<void>;
    getComments: (sightingId: string) => Promise<any>;
    createComment: (sightingId: string, text: string) => Promise<any>;
    deleteComment: (sightingId: string, commentId: string) => Promise<void>;
};
//# sourceMappingURL=useSightings.d.ts.map