"""Configuration settings for the AI service."""
import os


class Settings:
    """Application settings loaded from environment variables."""
    YOLO_MODEL: str = os.getenv("YOLO_MODEL", "yolov8n.pt")
    CONFIDENCE_THRESHOLD: float = float(os.getenv("CONFIDENCE_THRESHOLD", "0.5"))
    BACKEND_URL: str = os.getenv("BACKEND_URL", "http://localhost:8080")
    MAX_CAMERAS: int = int(os.getenv("MAX_CAMERAS", "10"))
    TARGET_FPS: int = int(os.getenv("TARGET_FPS", "15"))
    PERSON_CLASS_ID: int = 0


settings = Settings()
