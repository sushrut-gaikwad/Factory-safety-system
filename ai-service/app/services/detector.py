"""YOLOv8-based human detection engine."""
import numpy as np
import logging
from app.config import settings
from app.models.detection import BoundingBox, DetectionResult

logger = logging.getLogger(__name__)


class HumanDetector:
    """Detects humans in video frames using YOLOv8."""

    def __init__(self):
        self.model = None

    def load_model(self):
        """Load the YOLOv8 model. Call once at startup."""
        from ultralytics import YOLO
        logger.info(f"Loading YOLO model: {settings.YOLO_MODEL}")
        self.model = YOLO(settings.YOLO_MODEL)
        logger.info("YOLO model loaded successfully")

    def detect(self, frame: np.ndarray) -> list:
        """Run detection on a single frame. Returns list of DetectionResult."""
        if self.model is None:
            raise RuntimeError("Model not loaded. Call load_model() first.")

        results = self.model(frame, conf=settings.CONFIDENCE_THRESHOLD, verbose=False)
        detections = []

        for result in results:
            boxes = result.boxes
            if boxes is None:
                continue
            for box in boxes:
                cls_id = int(box.cls[0])
                if cls_id != settings.PERSON_CLASS_ID:
                    continue
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                conf = float(box.conf[0])
                detections.append(DetectionResult(
                    track_id=-1,
                    confidence=round(conf, 3),
                    bbox=BoundingBox(x=x1, y=y1, width=x2 - x1, height=y2 - y1),
                    class_name="person"
                ))
        return detections


detector = HumanDetector()
