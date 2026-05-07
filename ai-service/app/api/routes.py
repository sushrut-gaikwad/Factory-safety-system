"""FastAPI routes for the AI service."""
import cv2
import time
import logging
from fastapi import APIRouter
from fastapi.responses import StreamingResponse, JSONResponse
from app.services.camera_manager import camera_manager
from app.models.detection import CameraStartRequest, CameraStopRequest

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api")


@router.post("/cameras/start")
async def start_camera(request: CameraStartRequest):
    """Start processing a camera stream."""
    logger.info(f"Starting camera {request.camera_id}: {request.stream_url}")
    status = camera_manager.start_camera(request.camera_id, request.stream_url)
    return status.model_dump()


@router.post("/cameras/stop")
async def stop_camera(request: CameraStopRequest):
    """Stop processing a camera stream."""
    logger.info(f"Stopping camera {request.camera_id}")
    status = camera_manager.stop_camera(request.camera_id)
    return status.model_dump()


@router.post("/cameras/stop-all")
async def stop_all_cameras():
    """Stop all camera streams (emergency stop)."""
    logger.warning("EMERGENCY: Stopping all cameras")
    camera_manager.stop_all()
    return {"status": "all_stopped"}


@router.get("/cameras/status")
async def get_camera_status():
    """Get status of all active cameras."""
    statuses = camera_manager.get_all_status()
    return {"cameras": [s.model_dump() for s in statuses]}


@router.get("/stream/{camera_id}")
async def stream_camera(camera_id: int):
    """MJPEG stream endpoint for annotated camera feed."""
    import numpy as np

    def generate():
        blank_sent = 0
        while True:
            frame = camera_manager.get_frame(camera_id, annotated=True)
            if frame is None:
                blank_sent += 1
                # Create "No Signal" or "Waiting" frame
                frame = np.zeros((480, 640, 3), dtype=np.uint8)
                if blank_sent < 10:
                    cv2.putText(frame, "Connecting...", (180, 230),
                                cv2.FONT_HERSHEY_SIMPLEX, 1.2, (100, 100, 255), 2)
                    cv2.putText(frame, f"Camera {camera_id}", (220, 270),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (150, 150, 150), 1)
                else:
                    cv2.putText(frame, "No Signal", (200, 230),
                                cv2.FONT_HERSHEY_SIMPLEX, 1.5, (0, 0, 255), 2)
                    cv2.putText(frame, "Check camera connection", (150, 270),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (150, 150, 150), 1)
                time.sleep(0.5)  # Don't spin CPU on blank frames
            else:
                blank_sent = 0
                time.sleep(0.033)  # ~30fps max

            _, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 70])
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

    return StreamingResponse(
        generate(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )


@router.get("/health")
async def health_check():
    """Service health check."""
    active = len(camera_manager.cameras)
    return {"status": "healthy", "active_cameras": active}
