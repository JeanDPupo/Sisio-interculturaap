import axios from 'axios';
import { useOfflineStore } from '../store/offlineStore';
import { API_BASE_URL } from '../utils/env';
export class ApiService {
    constructor() {
        Object.defineProperty(this, "client", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "accessToken", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        this.client = axios.create({
            baseURL: API_BASE_URL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        // Response interceptor for offline handling
        this.client.interceptors.response.use((response) => response, (error) => {
            if (!navigator.onLine) {
                useOfflineStore.setState({ isOnline: false });
            }
            return Promise.reject(error);
        });
    }
    setAccessToken(token) {
        this.accessToken = token;
        if (token) {
            this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        else {
            delete this.client.defaults.headers.common['Authorization'];
        }
    }
    // Auth endpoints
    async register(name, email, password) {
        return this.client.post('/auth/register', {
            name,
            email,
            password,
        });
    }
    async login(email, password) {
        return this.client.post('/auth/login', {
            email,
            password,
        });
    }
    async createGuestUser(name) {
        return this.client.post('/auth/guest', null, {
            params: { name },
        });
    }
    async upgradeGuestUser(guestId, email, password) {
        return this.client.post('/auth/upgrade-guest', {
            guest_id: guestId,
            email,
            password,
        });
    }
    async refreshToken(refreshToken) {
        return this.client.post('/auth/refresh', null, {
            params: { refresh_token: refreshToken },
        });
    }
    async getCurrentUser() {
        return this.client.get('/auth/me');
    }
    async updateUserProfile(updates) {
        return this.client.patch('/auth/me', updates);
    }
    async logout() {
        return this.client.post('/auth/logout');
    }
    // Bird endpoints
    async identifyBirdFromPhoto(file, latitude, longitude) {
        const formData = new FormData();
        formData.append('file', file);
        if (latitude && longitude) {
            formData.append('latitude', latitude.toString());
            formData.append('longitude', longitude.toString());
        }
        return this.client.post('/photo/identify', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }
    async identifyBirdFromAudio(file, latitude, longitude) {
        const formData = new FormData();
        formData.append('file', file);
        if (latitude && longitude) {
            formData.append('latitude', latitude.toString());
            formData.append('longitude', longitude.toString());
        }
        return this.client.post('/audio/identify', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }
    async getBirds(limit = 20, offset = 0) {
        return this.client.get('/birds', { params: { limit, offset } });
    }
    async getBirdById(id) {
        return this.client.get(`/birds/${id}`);
    }
    async searchBirds(query) {
        return this.client.get('/birds/search', { params: { q: query } });
    }
    // Sighting endpoints
    async createSighting(data) {
        return this.client.post('/sightings', data);
    }
    async getSightings(userId, limit = 20, offset = 0) {
        return this.client.get('/sightings', {
            params: { user_id: userId, limit, offset },
        });
    }
    async getSightingById(id) {
        return this.client.get(`/sightings/${id}`);
    }
    async getSightingsForMap(bounds) {
        return this.client.get('/sightings/map', { params: { bounds } });
    }
    async updateSighting(id, updates) {
        return this.client.patch(`/sightings/${id}`, updates);
    }
    async deleteSighting(id) {
        return this.client.delete(`/sightings/${id}`);
    }
    // Comment endpoints
    async getComments(sightingId) {
        return this.client.get(`/sightings/${sightingId}/comments`);
    }
    async createComment(sightingId, text) {
        return this.client.post(`/sightings/${sightingId}/comments`, { text });
    }
    async deleteComment(sightingId, commentId) {
        return this.client.delete(`/sightings/${sightingId}/comments/${commentId}`);
    }
    // Admin endpoints
    async getAdminStats() {
        return this.client.get('/admin/stats');
    }
    async getAdminSightings(limit = 100) {
        return this.client.get('/admin/sightings', { params: { limit } });
    }
    async getAdminSightingsMap() {
        return this.client.get('/admin/sightings/map');
    }
    async getFlaggedContent() {
        return this.client.get('/admin/moderation');
    }
    async moderateSighting(sightingId, action) {
        return this.client.post(`/admin/moderate/${sightingId}`, null, {
            params: { action },
        });
    }
    // Health check
    async checkHealth() {
        return this.client.get('/');
    }
}
export const apiService = new ApiService();
//# sourceMappingURL=apiService.js.map