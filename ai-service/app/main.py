"""FastAPI entry point for the AI service."""
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
from app.services.tracker import tracker
from app.services.camera_manager import camera_manager

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Factory Safety AI Service",
    description="Real-time human detection and tracking using YOLOv8",
    version="1.0.0"
)

# CORS — allow all origins for local network operation
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(router)


@app.on_event("startup")
async def startup_event():
    """Load AI models on application startup."""
    logger.info("Starting Factory Safety AI Service...")
    tracker.load_model()
    logger.info("AI Service ready — models loaded")


@app.on_event("shutdown")
async def shutdown_event():
    """Release all camera resources on shutdown."""
    logger.info("Shutting down AI Service...")
    camera_manager.stop_all()
    logger.info("All cameras released")
