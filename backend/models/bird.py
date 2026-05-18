from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid

class AncestralKnowledge(BaseModel):
    historias: List[str] = []
    refranes: List[str] = []
    roles_cosmovision: Optional[str] = None
    significado_cultural: Optional[str] = None

class BirdBase(BaseModel):
    nombre_cientifico: str
    nombre_espanol: Optional[str] = None
    nombre_nativo: Optional[str] = None
    lengua: Optional[str] = None
    significado_ancestral: Optional[str] = None
    rol_cosmovision: Optional[str] = None
    comportamientos: Optional[str] = None
    habitat: Optional[str] = None
    zona_geografica: Optional[str] = None
    es_migratoria: bool = False
    periodo_migracion: Optional[str] = None
    ecosistema_riesgo: str = "bajo"

class BirdCreate(BirdBase):
    imagen_url: Optional[str] = None
    audio_url: Optional[str] = None
    historias_ancestrales: List[str] = []
    refranes: List[str] = []

class BirdUpdate(BaseModel):
    nombre_espanol: Optional[str] = None
    descripcion: Optional[str] = None
    ecosistema_riesgo: Optional[str] = None

class BirdResponse(BirdBase):
    id: uuid.UUID
    imagen_url: Optional[str]
    audio_url: Optional[str]
    historias_ancestrales: List[Dict[str, Any]] = []
    refranes: List[Dict[str, Any]] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class BirdIdentificationResponse(BaseModel):
    bird_id: Optional[uuid.UUID] = None
    bird: Optional[BirdResponse] = None
    confidence: float
    ancestral_knowledge: Optional[AncestralKnowledge] = None
    ecosystem_risk: Optional[str] = None
    location_match: Optional[bool] = None
    belongs_to_location: Optional[bool] = None
    migration_status: Optional[str] = None
