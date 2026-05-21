from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
import logging
import os
from dotenv import load_dotenv
from datetime import datetime

from routers import photo, audio, birds
from routers import auth, sightings, comments, admin

load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Sisio Interculturaap API",
    description="Backend para reconocimiento de aves con conocimiento ancestral indígena",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# CORS Configuration
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global exception handler
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "detail": "Validation error",
            "errors": exc.errors()
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error"
        }
    )

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(birds.router, prefix="/api")
app.include_router(photo.router, prefix="/api/photo", tags=["Photo Recognition"])
app.include_router(audio.router, prefix="/api/audio", tags=["Audio Recognition"])
app.include_router(sightings.router, prefix="/api")
app.include_router(comments.router, prefix="/api")
app.include_router(admin.router, prefix="/api")

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "Sisio Interculturaap API"
    }

# Root endpoint
@app.get("/")
async def root():
    return {
        "status": "ok",
        "proyecto": "Sisio Interculturaap",
        "version": "1.0.0",
        "description": "Reconocimiento de aves con conocimiento ancestral",
        "docs": "/api/docs"
    }

# Startup event
@app.on_event("startup")
async def startup_event():
    logger.info("Starting Sisio Interculturaap API v1.0.0")
    logger.info(f"CORS origins: {ALLOWED_ORIGINS}")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down Sisio Interculturaap API")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=os.getenv("ENV", "development") == "development"
    )
