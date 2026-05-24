from fastapi import APIRouter, UploadFile, File, HTTPException
from services import supabase_service
from models.bird import BirdIdentificationResponse, BirdResponse, AncestralKnowledge
from datetime import datetime
import uuid

router = APIRouter()

def _parse_ficha(ficha: dict) -> BirdResponse:
    historias = ficha.get("historias_ancestrales") or []
    refranes = ficha.get("refranes") or []
    if isinstance(historias, str):
        historias = []
    if isinstance(refranes, str):
        refranes = []
    return BirdResponse(
        id=ficha.get("id", uuid.uuid4()),
        nombre_cientifico=ficha.get("nombre_cientifico", ""),
        nombre_espanol=ficha.get("nombre_espanol"),
        nombre_nativo=ficha.get("nombre_nativo"),
        lengua=ficha.get("lengua"),
        significado_ancestral=ficha.get("significado_ancestral"),
        rol_cosmovision=ficha.get("rol_cosmovision"),
        comportamientos=ficha.get("comportamientos"),
        habitat=ficha.get("habitat"),
        zona_geografica=ficha.get("zona_geografica"),
        es_migratoria=ficha.get("es_migratoria", False),
        periodo_migracion=ficha.get("periodo_migracion"),
        ecosistema_riesgo=ficha.get("ecosistema_riesgo", "bajo"),
        imagen_url=ficha.get("imagen_url"),
        audio_url=ficha.get("audio_url"),
        historias_ancestrales=historias,
        refranes=refranes,
        created_at=ficha.get("created_at", datetime.utcnow()),
        updated_at=ficha.get("updated_at", datetime.utcnow()),
    )

@router.post("/identify", response_model=BirdIdentificationResponse)
async def identify_by_photo(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="El archivo debe ser una imagen.")

    img_bytes = await file.read()

    from services.identify import identify_photo
    species_name = await identify_photo(img_bytes)
    if not species_name:
        raise HTTPException(status_code=404, detail="No se pudo identificar el ave.")

    ficha = await supabase_service.get_ficha(species_name)
    if not ficha:
        return BirdIdentificationResponse(
            confidence=0.0,
            bird=None,
            bird_id=None,
        )

    bird = _parse_ficha(ficha)
    return BirdIdentificationResponse(
        bird_id=bird.id,
        bird=bird,
        confidence=0.85,
        ancestral_knowledge=AncestralKnowledge(
            historias=bird.historias_ancestrales or [],
            refranes=bird.refranes or [],
            roles_cosmovision=bird.rol_cosmovision,
            significado_cultural=bird.significado_ancestral,
        ),
        ecosystem_risk=bird.ecosistema_riesgo,
        location_match=True,
        migration_status=bird.periodo_migracion,
    )
