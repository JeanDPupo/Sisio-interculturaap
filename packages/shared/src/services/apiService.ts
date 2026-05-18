import axios, { AxiosInstance, AxiosError } from 'axios';
import { useOfflineStore } from '../store/offlineStore';
import { v4 as uuidv4 } from 'uuid';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export class ApiService {
  private client: AxiosInstance;
  private accessToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Response interceptor for offline handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (!navigator.onLine) {
          useOfflineStore.setState({ isOnline: false });
        }
        return Promise.reject(error);
      }
    );
  }

  setAccessToken(token: string | null) {
    this.accessToken = token;
    if (token) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.client.defaults.headers.common['Authorization'];
    }
  }

  // Auth endpoints
  async register(name: string, email: string, password: string) {
    return this.client.post('/auth/register', {
      name,
      email,
      password,
    });
  }

  async login(email: string, password: string) {
    return this.client.post('/auth/login', {
      email,
      password,
    });
  }

  async createGuestUser(name: string) {
    return this.client.post('/auth/guest', null, {
      params: { name },
    });
  }

  async upgradeGuestUser(guestId: string, email: string, password: string) {
    return this.client.post('/auth/upgrade-guest', {
      guest_id: guestId,
      email,
      password,
    });
  }

  async refreshToken(refreshToken: string) {
    return this.client.post('/auth/refresh', null, {
      params: { refresh_token: refreshToken },
    });
  }

  async getCurrentUser() {
    return this.client.get('/auth/me');
  }

  async updateUserProfile(updates: Record<string, unknown>) {
    return this.client.patch('/auth/me', updates);
  }

  async logout() {
    return this.client.post('/auth/logout');
  }

  // Bird endpoints
  async identifyBirdFromPhoto(file: File, latitude?: number, longitude?: number) {
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

  async identifyBirdFromAudio(file: File, latitude?: number, longitude?: number) {
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

  async getBirds(limit: number = 20, offset: number = 0) {
    return this.client.get('/birds', { params: { limit, offset } });
  }

  async getBirdById(id: string) {
    return this.client.get(`/birds/${id}`);
  }

  async searchBirds(query: string) {
    return this.client.get('/birds/search', { params: { q: query } });
  }

  // Sighting endpoints
  async createSighting(data: Record<string, unknown>) {
    return this.client.post('/sightings', data);
  }

  async getSightings(userId?: string, limit: number = 20, offset: number = 0) {
    return this.client.get('/sightings', {
      params: { user_id: userId, limit, offset },
    });
  }

  async getSightingById(id: string) {
    return this.client.get(`/sightings/${id}`);
  }

  async getSightingsForMap(bounds?: string) {
    return this.client.get('/sightings/map', { params: { bounds } });
  }

  async updateSighting(id: string, updates: Record<string, unknown>) {
    return this.client.patch(`/sightings/${id}`, updates);
  }

  async deleteSighting(id: string) {
    return this.client.delete(`/sightings/${id}`);
  }

  // Comment endpoints
  async getComments(sightingId: string) {
    return this.client.get(`/sightings/${sightingId}/comments`);
  }

  async createComment(sightingId: string, text: string) {
    return this.client.post(`/sightings/${sightingId}/comments`, { text });
  }

  async deleteComment(sightingId: string, commentId: string) {
    return this.client.delete(`/sightings/${sightingId}/comments/${commentId}`);
  }

  // Admin endpoints
  async getAdminStats() {
    return this.client.get('/admin/stats');
  }

  async getAdminSightings(limit: number = 100) {
    return this.client.get('/admin/sightings', { params: { limit } });
  }

  async getAdminSightingsMap() {
    return this.client.get('/admin/sightings/map');
  }

  async getFlaggedContent() {
    return this.client.get('/admin/moderation');
  }

  async moderateSighting(sightingId: string, action: 'approve' | 'reject') {
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
