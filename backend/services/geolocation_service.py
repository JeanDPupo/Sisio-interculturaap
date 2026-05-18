import httpx
import os
from typing import Optional, Dict, Any
from dotenv import load_dotenv

load_dotenv()

GOOGLE_GEOLOC_API_KEY = os.getenv("GOOGLE_GEOLOC_API_KEY", "")
GOOGLE_GEOLOC_URL = "https://www.googleapis.com/geolocation/v1/geolocate"
GOOGLE_REVERSE_GEOCODING_URL = "https://maps.googleapis.com/maps/api/geocode/json"

async def reverse_geocode(latitude: float, longitude: float) -> Optional[str]:
    """
    Get address from coordinates using Google Reverse Geocoding.
    """
    if not GOOGLE_GEOLOC_API_KEY:
        return f"{latitude}, {longitude}"

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(
                GOOGLE_REVERSE_GEOCODING_URL,
                params={
                    "latlng": f"{latitude},{longitude}",
                    "key": GOOGLE_GEOLOC_API_KEY,
                    "language": "es"
                }
            )

            if response.status_code == 200:
                data = response.json()
                if data["results"]:
                    return data["results"][0]["formatted_address"]
    except Exception as e:
        print(f"Error in reverse geocoding: {e}")

    return f"{latitude}, {longitude}"

def check_bird_belongs_to_location(
    bird_zone: Optional[str],
    latitude: float,
    longitude: float
) -> bool:
    """
    Simple check if bird belongs to location based on zone.
    In production, this should use GIS spatial queries.
    """
    if not bird_zone:
        return False

    # TODO: Implement proper GIS spatial analysis
    # For now, return a placeholder based on zone name
    known_zones = {
        "sierra_nevada": {"lat_min": 10, "lat_max": 11, "lon_min": -75, "lon_max": -74},
        "magdalena": {"lat_min": 10, "lat_max": 11, "lon_min": -74.5, "lon_max": -74},
    }

    zone_data = known_zones.get(bird_zone.lower())
    if not zone_data:
        return False

    return (
        zone_data["lat_min"] <= latitude <= zone_data["lat_max"]
        and zone_data["lon_min"] <= longitude <= zone_data["lon_max"]
    )

def calculate_ecosystem_risk(
    bird_zone: Optional[str],
    is_migrating: bool,
    belongs_to_location: bool
) -> str:
    """
    Calculate ecosystem risk based on bird characteristics.
    Levels: bajo, medio, alto
    """
    if not belongs_to_location:
        return "alto" if is_migrating else "medio"

    if is_migrating:
        return "bajo" if belongs_to_location else "alto"

    return "bajo"

async def get_location_info(latitude: float, longitude: float) -> Dict[str, Any]:
    """
    Get comprehensive location information.
    """
    address = await reverse_geocode(latitude, longitude)

    return {
        "latitude": latitude,
        "longitude": longitude,
        "address": address,
    }
