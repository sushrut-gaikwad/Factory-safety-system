"""Pydantic models for detection data."""
from pydantic import BaseModel
from typing import List, Optional


class BoundingBox(BaseModel):
    """Bounding box coordinates."""
    x: float
    y: float
    width: float
    height: float


class DetectionResult(BaseModel):
    """Single detection result."""
    track_id: int = -1
    confidence: float
    bbox: BoundingBox
    class_name: str = "person"
    has_helmet: bool = False
    has_vest: bool = False
    ppe_compliant: bool = False


class FrameDetections(BaseModel):
    """Detection results for a single frame."""
    camera_id: int
    timestamp: str
    frame_number: int
    detections: List[DetectionResult]
    fps: float
    total_persons: int = 0
    ppe_compliant_count: int = 0
    ppe_violation_count: int = 0


class CameraStartRequest(BaseModel):
    """Request to start camera processing."""
    camera_id: int
    stream_url: str


class CameraStopRequest(BaseModel):
    """Request to stop camera processing."""
    camera_id: int


class CameraStatus(BaseModel):
    """Camera processing status."""
    camera_id: int
    is_running: bool
    fps: float = 0.0
    frame_count: int = 0
    error: Optional[str] = None
