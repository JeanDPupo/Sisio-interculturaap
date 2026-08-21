import { AdminStats, ModerationQueue } from '../types';
export declare const useAdmin: () => {
    stats: AdminStats | null;
    moderation: ModerationQueue | null;
    loading: boolean;
    error: string | null;
    getStats: () => Promise<AdminStats>;
    getModerationQueue: () => Promise<ModerationQueue>;
    moderateSighting: (sightingId: string, action: "approve" | "reject") => Promise<any>;
};
//# sourceMappingURL=useAdmin.d.ts.map