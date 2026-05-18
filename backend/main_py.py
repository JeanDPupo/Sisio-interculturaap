from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import photo, audio
from routers import auth, sightings, comments, admin

app = FastAPI(
    title="Sisio interculturaap API",
    description="Backend para reconocimiento de aves con conocimiento ancestral",
    version="0.2.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, restringir al dominio de la app
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(photo, prefix="/photo", tags=["Reconocimiento por Foto"])
app.include_router(audio, prefix="/audio", tags=["Reconocimiento por Audio"])
app.include_router(sightings.router)
app.include_router(comments.router)
app.include_router(admin.router)

@app.get("/")
def root():
    return {"status": "ok", "proyecto": "Sisio interculturaap", "version": "0.2.0"}
