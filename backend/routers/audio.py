from fastapi import APIRouter, UploadFile, File, HTTPException
from starlette.concurrency import run_in_threadpool
import os
import tempfile
from services import supabase_service

router = APIRouter()

@router.post("/identify")
async def identify_by_audio(file: UploadFile = File(...)):
    """
    Recibe un archivo de audio WAV y retorna la ficha ancestral del ave identificada.
    """
    content_type = file.content_type or ""
    if not content_type.startswith("audio/") and not file.filename.lower().endswith(".wav"):
        raise HTTPException(status_code=400, detail="El archivo debe ser un audio WAV.")

    # Guardar archivo temporalmente
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
        temp_file.write(await file.read())
        temp_path = temp_file.name

    try:
        # 1. Identificar ave con BirdNET (lazy import)
        from services import birdnet
        species_name = await run_in_threadpool(birdnet.identify, temp_path)
        if not species_name:
            raise HTTPException(status_code=404, detail="No se detectó ningún ave en el audio proporcionado.")

        # 2. Buscar ficha ancestral en Supabase
        ficha = await supabase_service.get_ficha(species_name)
        if not ficha:
            return {
                "especie_identificada": species_name,
                "ficha_ancestral": None,
                "mensaje": "Ave identificada pero aún no tiene ficha ancestral registrada."
            }

        return {"especie_identificada": species_name, "ficha_ancestral": ficha}
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    finally:
        # Limpiar archivo temporal
        os.unlink(temp_path)