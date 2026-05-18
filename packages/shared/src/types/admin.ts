export interface AdminStats {
  total_users: number;
  total_sightings: number;
  total_birds_identified: number;
  sightings_this_week: number;
  species_distribution: Record<string, number>;
  ecosystem_risk_distribution: Record<string, number>;
  top_locations: Record<string, number>;
  user_engagement: Record<string, unknown>;
}

export interface AdminSighting {
  id: string;
  user_name?: string;
  bird_name: string;
  location: Record<string, unknown>;
  confidence: number;
  ecosystem_risk: string;
  timestamp: string;
  is_approved: boolean;
  photo_url?: string;
}

export interface ModerationQueue {
  flagged_sightings: unknown[];
  flagged_comments: unknown[];
  total_flagged: number;
}

export interface AdminMapSighting {
  id: string;
  latitude: number;
  longitude: number;
  ecosystem_risk: string;
  bird_id: string;
  timestamp: string;
}
