export interface AncestralKnowledge {
    historias: string[];
    refranes: string[];
    roles_cosmovision?: string;
    significado_cultural?: string;
}
export interface Bird {
    id: string;
    nombre_cientifico: string;
    nombre_espanol?: string;
    nombre_nativo?: string;
    lengua?: string;
    significado_ancestral?: string;
    rol_cosmovision?: string;
    comportamientos?: string;
    habitat?: string;
    zona_geografica?: string;
    es_migratoria: boolean;
    periodo_migracion?: string;
    imagen_url?: string;
    audio_url?: string;
    historias_ancestrales: string[];
    refranes: string[];
    ecosistema_riesgo: 'bajo' | 'medio' | 'alto';
    created_at: string;
    updated_at: string;
}
export interface BirdIdentificationResult {
    bird_id?: string;
    bird?: Bird;
    confidence: number;
    ancestral_knowledge?: AncestralKnowledge;
    ecosystem_risk?: 'bajo' | 'medio' | 'alto';
    location_match?: boolean;
    belongs_to_location?: boolean;
    migration_status?: string;
}
export interface BirdSearchFilter {
    nombre_cientifico?: string;
    zona_geografica?: string;
    es_migratoria?: boolean;
    search_query?: string;
    limit?: number;
    offset?: number;
}
//# sourceMappingURL=bird.d.ts.map