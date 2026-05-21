from fastapi import APIRouter, UploadFile, File, HTTPException
from services import supabase_service

router = APIRouter()

@router.post("/identify")
async def identify_by_photo(file: UploadFile = File(...)):
    """
    Recibe una foto y retorna la ficha ancestral del ave identificada.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="El archivo debe ser una imagen.")

    img_bytes = await file.read()

    # 1. Identificar ave con iNaturalist (lazy import)
    from services import inaturalist
    species_name = await inaturalist.identify(img_bytes)
    if not species_name:
        raise HTTPException(status_code=404, detail="No se pudo identificar el ave.")

    # 2. Buscar ficha ancestral en Supabase
    ficha = await supabase_service.get_ficha(species_name)
    if not ficha:
        return {
            "especie_identificada": species_name,
            "ficha_ancestral": None,
            "mensaje": "Ave identificada pero aún no tiene ficha ancestral registrada."
        }

    return {"especie_identificada": species_name, "ficha_ancestral": ficha}
