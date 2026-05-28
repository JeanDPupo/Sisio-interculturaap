import { User } from '../types';
export declare const useAuth: () => {
    user: User | null;
    isAuthenticated: boolean;
    isGuest: boolean;
    accessToken: string | null;
    loading: boolean;
    error: string | null;
    register: any;
    login: any;
    createGuestUser: any;
    upgradeGuestToRegistered: any;
    logout: any;
    refreshAccessToken: any;
    updateProfile: any;
};
//# sourceMappingURL=useAuth.d.ts.map