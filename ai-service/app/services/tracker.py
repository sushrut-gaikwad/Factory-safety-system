"""ByteTrack-based object tracker with PPE detection."""
import cv2
import numpy as np
import logging
from app.config import settings
from app.models.detection import BoundingBox, DetectionResult

logger = logging.getLogger(__name__)


def check_ppe(frame, x1, y1, x2, y2):
    """Check for PPE (helmet and vest) using color analysis.
    
    Helmet: Check head region for bright/yellow/white/orange colors typical of hardhats.
    Vest: Check torso region for high-visibility yellow/orange/green colors.
    """
    h_frame, w_frame = frame.shape[:2]
    x1, y1, x2, y2 = int(max(0,x1)), int(max(0,y1)), int(min(w_frame,x2)), int(min(h_frame,y2))
    
    person_h = y2 - y1
    person_w = x2 - x1
    if person_h < 40 or person_w < 20:
        return False, False
    
    # Head region: top 20% of person
    head_y1 = y1
    head_y2 = y1 + int(person_h * 0.2)
    head_region = frame[head_y1:head_y2, x1:x2]
    
    # Torso region: 25%-60% of person
    torso_y1 = y1 + int(person_h * 0.25)
    torso_y2 = y1 + int(person_h * 0.6)
    torso_region = frame[torso_y1:torso_y2, x1:x2]
    
    has_helmet = False
    has_vest = False
    
    if head_region.size > 0:
        hsv = cv2.cvtColor(head_region, cv2.COLOR_BGR2HSV)
        # Yellow hardhat: H=20-35, S>80, V>100
        yellow_mask = cv2.inRange(hsv, np.array([15, 80, 100]), np.array([35, 255, 255]))
        # White hardhat: H=0-180, S<50, V>180
        white_mask = cv2.inRange(hsv, np.array([0, 0, 180]), np.array([180, 50, 255]))
        # Orange hardhat: H=5-20, S>100, V>100
        orange_mask = cv2.inRange(hsv, np.array([5, 100, 100]), np.array([20, 255, 255]))
        
        total_pixels = head_region.shape[0] * head_region.shape[1]
        helmet_pixels = cv2.countNonZero(yellow_mask) + cv2.countNonZero(white_mask) + cv2.countNonZero(orange_mask)
        if total_pixels > 0 and helmet_pixels / total_pixels > 0.15:
            has_helmet = True
    
    if torso_region.size > 0:
        hsv = cv2.cvtColor(torso_region, cv2.COLOR_BGR2HSV)
        # High-vis yellow vest: H=20-35, S>100, V>120
        hivis_yellow = cv2.inRange(hsv, np.array([15, 100, 120]), np.array([35, 255, 255]))
        # High-vis orange vest: H=5-20, S>100, V>120
        hivis_orange = cv2.inRange(hsv, np.array([5, 100, 120]), np.array([20, 255, 255]))
        # High-vis green vest: H=35-85, S>60, V>80
        hivis_green = cv2.inRange(hsv, np.array([35, 60, 80]), np.array([85, 255, 255]))
        
        total_pixels = torso_region.shape[0] * torso_region.shape[1]
        vest_pixels = cv2.countNonZero(hivis_yellow) + cv2.countNonZero(hivis_orange) + cv2.countNonZero(hivis_green)
        if total_pixels > 0 and vest_pixels / total_pixels > 0.2:
            has_vest = True
    
    return has_helmet, has_vest


class ObjectTracker:
    """Tracks detected persons across frames using ByteTrack via ultralytics."""

    def __init__(self):
        self.model = None

    def load_model(self):
        """Load the YOLO model configured for tracking."""
        from ultralytics import YOLO
        logger.info(f"Loading YOLO model for tracking: {settings.YOLO_MODEL}")
        self.model = YOLO(settings.YOLO_MODEL)
        logger.info("Tracker model loaded successfully")

    def track(self, frame: np.ndarray) -> list:
        """Run detection + tracking + PPE check on a frame."""
        if self.model is None:
            raise RuntimeError("Model not loaded. Call load_model() first.")

        results = self.model.track(
            frame,
            conf=settings.CONFIDENCE_THRESHOLD,
            persist=True,
            tracker="bytetrack.yaml",
            verbose=False
        )

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
                track_id = int(box.id[0]) if box.id is not None else -1
                
                # PPE check
                has_helmet, has_vest = check_ppe(frame, x1, y1, x2, y2)
                
                detections.append(DetectionResult(
                    track_id=track_id,
                    confidence=round(conf, 3),
                    bbox=BoundingBox(x=x1, y=y1, width=x2 - x1, height=y2 - y1),
                    class_name="person",
                    has_helmet=has_helmet,
                    has_vest=has_vest,
                    ppe_compliant=has_helmet and has_vest,
                ))
        return detections


tracker = ObjectTracker()
