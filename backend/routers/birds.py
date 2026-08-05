from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from typing import Optional, List
from pydantic import BaseModel
import os
import logging
import tempfile
from dotenv import load_dotenv
from starlette.concurrency import run_in_threadpool



load_dotenv()
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/birds", tags=["Birds"])

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

from services.local_client import get_client

def _get_supabase():
    return get_client()

def _db_to_response(bird: dict) -> dict:
    """Map a DB row from `aves` table to the API response format (matching frontend Bird type)."""
    return {
        "id": str(bird["id"]),
        "nombre_cientifico": bird.get("nombre_cientifico", ""),
        "nombre_espanol": bird.get("nombre_espanol"),
        "descripcion": bird.get("descripcion"),
        "ecosistema_riesgo": bird.get("ecosistema_riesgo", "bajo"),
        "imagen_url": bird.get("imagen_url"),
        "habitat": bird.get("habitat"),
        "dieta": bird.get("dieta"),
        "conocimiento_ancestral": bird.get("conocimiento_ancestral"),
        "zona_geografica": bird.get("zona_geografica"),
        "es_migratoria": bird.get("es_migratoria", False),
        "created_at": bird.get("created_at"),
        "updated_at": bird.get("updated_at"),
    }

class BirdResponse(BaseModel):
    id: str
    nombre_cientifico: str
    nombre_espanol: Optional[str] = None
    descripcion: Optional[str] = None
    ecosistema_riesgo: str = "bajo"
    imagen_url: Optional[str] = None
    habitat: Optional[str] = None
    dieta: Optional[str] = None
    conocimiento_ancestral: Optional[str] = None
    zona_geografica: Optional[str] = None
    es_migratoria: bool = False
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

class IdentificationResult(BaseModel):
    bird_id: Optional[str] = None
    bird_name: Optional[str] = None
    nombre_cientifico: Optional[str] = None
    confidence: float = 0.0
    ficha_ancestral: Optional[dict] = None
    ancestral_info: Optional[str] = None
    ecosystem_risk: Optional[str] = None

# ────────── GET /birds ──────────
@router.get("/", response_model=List[BirdResponse])
async def get_birds(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    search: Optional[str] = None,
    risk_level: Optional[str] = None
):
    """
    Get list of birds with optional filtering.
    """
    try:
        supabase = _get_supabase()
        query = supabase.table("aves").select("*")

        if search:
            query = query.ilike("nombre_espanol", f"%{search}%")
        if risk_level:
            query = query.eq("ecosistema_riesgo", risk_level)

        result = query.order("nombre_espanol").limit(limit).offset(offset).execute()
        return [_db_to_response(bird) for bird in result.data] if result.data else []
    except Exception as e:
        logger.error(f"Error getting birds: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching birds")

# ────────── GET /birds/search ──────────
@router.get("/search", response_model=List[BirdResponse])
async def search_birds(q: str = Query(..., min_length=2)):
    """
    Search birds by name or scientific name.
    """
    try:
        supabase = _get_supabase()
        result = supabase.table("aves").select("*").ilike(
            "nombre_espanol", f"%{q}%"
        ).execute()

        return [_db_to_response(bird) for bird in result.data] if result.data else []
    except Exception as e:
        logger.error(f"Error searching birds: {str(e)}")
        raise HTTPException(status_code=500, detail="Error searching birds")

# ────────── GET /birds/{bird_id} ──────────
@router.get("/{bird_id}", response_model=BirdResponse)
async def get_bird(bird_id: str):
    """
    Get detailed information about a specific bird.
    """
    try:
        supabase = _get_supabase()
        result = supabase.table("aves").select("*").eq("id", bird_id).execute()

        if not result.data:
            raise HTTPException(status_code=404, detail="Bird not found")

        return _db_to_response(result.data[0])
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting bird {bird_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching bird")

# ────────── POST /birds/identify-photo ──────────
@router.post("/identify-photo", response_model=IdentificationResult)
async def identify_by_photo(file: UploadFile = File(...)):
    """
    Identify a bird from a photo using iNaturalist AI.
    """
    try:
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")

        img_bytes = await file.read()

        # 1. Identify via active provider (lazy import)
        from services.identify import identify_photo
        species_name = await identify_photo(img_bytes)
        if not species_name:
            raise HTTPException(status_code=404, detail="No se pudo identificar el ave en la foto")

        # 2. Look up ancestral record in Supabase
        supabase = _get_supabase()
        result = supabase.table("aves").select("*").ilike("nombre_cientifico", species_name).limit(1).execute()

        if not result.data:
            return IdentificationResult(
                confidence=0.0,
                nombre_cientifico=species_name,
                bird_name=species_name,
                ancestral_info="Ave identificada pero aún no tiene ficha ancestral registrada."
            )

        bird = result.data[0]
        return IdentificationResult(
            bird_id=str(bird["id"]),
            bird_name=bird.get("nombre_espanol") or species_name,
            nombre_cientifico=species_name,
            confidence=0.95,
            ficha_ancestral=bird,
            ancestral_info=bird.get("conocimiento_ancestral"),
            ecosystem_risk=bird.get("ecosistema_riesgo"),
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error identifying bird from photo: {str(e)}")
        raise HTTPException(status_code=500, detail="Error identifying bird")

# ────────── POST /birds/identify-audio ──────────
@router.post("/identify-audio", response_model=IdentificationResult)
async def identify_by_audio(file: UploadFile = File(...)):
    """
    Identify a bird from audio (bird song/call) using BirdNET.
    """
    try:
        if not file.content_type or not file.content_type.startswith("audio/"):
            raise HTTPException(status_code=400, detail="File must be audio")

        # Save temp file for BirdNET (it reads from disk)
        audio_bytes = await file.read()
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            tmp.write(audio_bytes)
            tmp_path = tmp.name

        try:
            from services import birdnet
            species_name = await run_in_threadpool(birdnet.identify, tmp_path)
        finally:
            os.unlink(tmp_path)

        if not species_name:
            raise HTTPException(status_code=404, detail="No se detectó ningún ave en el audio")

        # Look up in Supabase
        supabase = _get_supabase()
        result = supabase.table("aves").select("*").ilike("nombre_cientifico", species_name).limit(1).execute()

        if not result.data:
            return IdentificationResult(
                confidence=0.0,
                nombre_cientifico=species_name,
                bird_name=species_name,
                ancestral_info="Ave identificada pero aún no tiene ficha ancestral registrada."
            )

        bird = result.data[0]
        return IdentificationResult(
            bird_id=str(bird["id"]),
            bird_name=bird.get("nombre_espanol") or species_name,
            nombre_cientifico=species_name,
            confidence=0.92,
            ficha_ancestral=bird,
            ancestral_info=bird.get("conocimiento_ancestral"),
            ecosystem_risk=bird.get("ecosistema_riesgo"),
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error identifying bird from audio: {str(e)}")
        raise HTTPException(status_code=500, detail="Error identifying bird")
