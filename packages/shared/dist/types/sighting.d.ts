import { Bird } from './bird';
import { User } from './user';
export interface Location {
    latitude: number;
    longitude: number;
    address?: string;
    community?: string;
}
export interface Sighting {
    id: string;
    user_id?: string;
    bird_id: string;
    location: Location;
    description?: string;
    photo_url?: string;
    audio_url?: string;
    confidence?: number;
    ecosystem_risk?: 'bajo' | 'medio' | 'alto';
    location_match?: boolean;
    is_approved: boolean;
    timestamp: string;
    created_at: string;
    updated_at: string;
}
export interface SightingWithBird extends Sighting {
    bird?: Bird;
    user?: User;
}
export interface SightingCreateData {
    bird_id: string;
    location: Location;
    description?: string;
    photo_url?: string;
    audio_url?: string;
    confidence?: number;
}
export interface SightingGroupedResponse {
    day?: string;
    bird?: string;
    location?: string;
    sightings: Sighting[];
    count: number;
}
export interface Comment {
    id: string;
    sighting_id: string;
    user_id?: string;
    user_name?: string;
    text: string;
    is_approved: boolean;
    created_at: string;
    updated_at: string;
}
export interface CommentCreateData {
    text: string;
}
export interface SightingState {
    sightings: Sighting[];
    loading: boolean;
    error: string | null;
    filter: {
        user_id?: string;
        groupby?: 'day' | 'bird' | 'location';
        limit: number;
        offset: number;
    };
}
//# sourceMappingURL=sighting.d.ts.map