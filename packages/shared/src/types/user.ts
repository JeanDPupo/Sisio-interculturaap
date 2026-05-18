export interface User {
  id: string;
  email?: string;
  name: string;
  bio?: string;
  profile_picture?: string;
  language: string;
  theme_preference: 'light' | 'dark';
  is_admin: boolean;
  is_guest: boolean;
  guest_id?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile extends Omit<User, 'is_admin' | 'is_guest'> {
  sightings_count?: number;
  joined_date: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  language?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}
