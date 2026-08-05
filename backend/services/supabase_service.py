from .local_client import get_client

_client = get_client()


async def get_ficha(nombre_cientifico: str) -> dict | None:
    """
    Busca en la BD local (SQLite) la ficha ancestral de un ave por nombre científico.
    """
    resp = (
        _client.table("aves")
        .select("*")
        .ilike("nombre_cientifico", nombre_cientifico)
        .limit(1)
        .execute()
    )
    data = resp.data
    return data[0] if data else None
