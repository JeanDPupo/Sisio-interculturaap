export declare class ApiService {
    private client;
    private accessToken;
    constructor();
    setAccessToken(token: string | null): void;
    register(name: string, email: string, password: string): Promise<import("axios").AxiosResponse<any, any, {}>>;
    login(email: string, password: string): Promise<import("axios").AxiosResponse<any, any, {}>>;
    createGuestUser(name: string): Promise<import("axios").AxiosResponse<any, any, {}>>;
    upgradeGuestUser(guestId: string, email: string, password: string): Promise<import("axios").AxiosResponse<any, any, {}>>;
    refreshToken(refreshToken: string): Promise<import("axios").AxiosResponse<any, any, {}>>;
    getCurrentUser(): Promise<import("axios").AxiosResponse<any, any, {}>>;
    updateUserProfile(updates: Record<string, unknown>): Promise<import("axios").AxiosResponse<any, any, {}>>;
    logout(): Promise<import("axios").AxiosResponse<any, any, {}>>;
    identifyBirdFromPhoto(file: File, latitude?: number, longitude?: number): Promise<import("axios").AxiosResponse<any, any, {}>>;
    identifyBirdFromAudio(file: File, latitude?: number, longitude?: number): Promise<import("axios").AxiosResponse<any, any, {}>>;
    getBirds(limit?: number, offset?: number): Promise<import("axios").AxiosResponse<any, any, {}>>;
    getBirdById(id: string): Promise<import("axios").AxiosResponse<any, any, {}>>;
    searchBirds(query: string): Promise<import("axios").AxiosResponse<any, any, {}>>;
    createSighting(data: Record<string, unknown>): Promise<import("axios").AxiosResponse<any, any, {}>>;
    getSightings(userId?: string, limit?: number, offset?: number): Promise<import("axios").AxiosResponse<any, any, {}>>;
    getSightingById(id: string): Promise<import("axios").AxiosResponse<any, any, {}>>;
    getSightingsForMap(bounds?: string): Promise<import("axios").AxiosResponse<any, any, {}>>;
    updateSighting(id: string, updates: Record<string, unknown>): Promise<import("axios").AxiosResponse<any, any, {}>>;
    deleteSighting(id: string): Promise<import("axios").AxiosResponse<any, any, {}>>;
    getComments(sightingId: string): Promise<import("axios").AxiosResponse<any, any, {}>>;
    createComment(sightingId: string, text: string): Promise<import("axios").AxiosResponse<any, any, {}>>;
    deleteComment(sightingId: string, commentId: string): Promise<import("axios").AxiosResponse<any, any, {}>>;
    getAdminStats(): Promise<import("axios").AxiosResponse<any, any, {}>>;
    getAdminSightings(limit?: number): Promise<import("axios").AxiosResponse<any, any, {}>>;
    getAdminSightingsMap(): Promise<import("axios").AxiosResponse<any, any, {}>>;
    getFlaggedContent(): Promise<import("axios").AxiosResponse<any, any, {}>>;
    moderateSighting(sightingId: string, action: 'approve' | 'reject'): Promise<import("axios").AxiosResponse<any, any, {}>>;
    checkHealth(): Promise<import("axios").AxiosResponse<any, any, {}>>;
}
export declare const apiService: ApiService;
//# sourceMappingURL=apiService.d.ts.map