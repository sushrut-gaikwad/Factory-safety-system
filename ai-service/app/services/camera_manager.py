"""Multi-camera stream manager with threaded processing."""
import cv2
import threading
import time
import requests
import logging
import numpy as np
from datetime import datetime
from typing import Dict, Optional
from app.config import settings
from app.services.tracker import tracker
from app.models.detection import CameraStatus, FrameDetections, DetectionResult

logger = logging.getLogger(__name__)


class CameraStream:
    """Manages a single camera stream with detection, tracking, and PPE check."""

    def __init__(self, camera_id: int, stream_url: str):
        self.camera_id = camera_id
        self.stream_url = stream_url
        self.is_running = False
        self.thread: Optional[threading.Thread] = None
        self.cap: Optional[cv2.VideoCapture] = None
        self.fps = 0.0
        self.frame_count = 0
        self.error: Optional[str] = None
        self.current_frame: Optional[np.ndarray] = None
        self.annotated_frame: Optional[np.ndarray] = None
        self.lock = threading.Lock()
        self.person_count = 0
        self.ppe_ok = 0
        self.ppe_fail = 0

    def start(self):
        """Start processing the camera stream in a background thread."""
        if self.is_running:
            return
        self.is_running = True
        self.error = None
        self.thread = threading.Thread(target=self._process_stream, daemon=True)
        self.thread.start()
        logger.info(f"Camera {self.camera_id} started processing")

    def stop(self):
        """Stop processing and release resources."""
        self.is_running = False
        if self.thread:
            self.thread.join(timeout=5)
        if self.cap:
            self.cap.release()
            self.cap = None
        logger.info(f"Camera {self.camera_id} stopped")

    def _process_stream(self):
        """Main processing loop: capture → detect → track → PPE → send."""
        try:
            source = int(self.stream_url) if self.stream_url.isdigit() else self.stream_url
            self.cap = cv2.VideoCapture(source)

            if not self.cap.isOpened():
                self.error = f"Failed to open stream: {self.stream_url}"
                self.is_running = False
                logger.error(self.error)
                return

            frame_delay = 1.0 / settings.TARGET_FPS
            logger.info(f"Camera {self.camera_id} stream opened: {self.stream_url}")

            while self.is_running:
                start_time = time.time()
                ret, frame = self.cap.read()

                if not ret:
                    if not str(self.stream_url).isdigit() and not str(self.stream_url).startswith("rtsp"):
                        self.cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                        continue
                    self.error = "Failed to read frame"
                    time.sleep(0.1)
                    continue

                with self.lock:
                    self.current_frame = frame.copy()

                # Run tracking (detection + ID assignment + PPE)
                detections = tracker.track(frame)

                # Draw bounding boxes on annotated frame
                annotated = frame.copy()
                ppe_ok = 0
                ppe_fail = 0
                
                for det in detections:
                    x, y = int(det.bbox.x), int(det.bbox.y)
                    w, h = int(det.bbox.width), int(det.bbox.height)
                    
                    # Color based on PPE compliance
                    if det.ppe_compliant:
                        color = (0, 255, 0)  # Green = PPE OK
                        ppe_ok += 1
                    else:
                        color = (0, 0, 255)  # Red = PPE violation
                        ppe_fail += 1
                    
                    cv2.rectangle(annotated, (x, y), (x + w, y + h), color, 2)
                    
                    # Label with track ID and PPE status
                    ppe_status = ""
                    if det.has_helmet and det.has_vest:
                        ppe_status = " [PPE:OK]"
                    elif det.has_helmet:
                        ppe_status = " [Helmet]"
                    elif det.has_vest:
                        ppe_status = " [Vest]"
                    else:
                        ppe_status = " [NO PPE!]"
                    
                    label = f"ID:{det.track_id} {det.confidence:.2f}{ppe_status}"
                    
                    # Background rectangle for label
                    (tw, th), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)
                    cv2.rectangle(annotated, (x, y - th - 8), (x + tw + 4, y), color, -1)
                    cv2.putText(annotated, label, (x + 2, y - 6),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
                    
                    # Helmet indicator circle on head
                    head_y = y + int(h * 0.1)
                    head_x = x + w // 2
                    helmet_color = (0, 255, 0) if det.has_helmet else (0, 0, 255)
                    cv2.circle(annotated, (head_x, head_y), 6, helmet_color, -1)
                    cv2.circle(annotated, (head_x, head_y), 7, (255,255,255), 1)

                # Draw stats overlay
                stats_text = f"Persons: {len(detections)} | PPE OK: {ppe_ok} | Violations: {ppe_fail}"
                cv2.rectangle(annotated, (0, 0), (len(stats_text) * 10 + 20, 30), (0, 0, 0), -1)
                cv2.putText(annotated, stats_text, (10, 20),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 1)

                with self.lock:
                    self.annotated_frame = annotated
                    self.person_count = len(detections)
                    self.ppe_ok = ppe_ok
                    self.ppe_fail = ppe_fail

                self.frame_count += 1

                # Send detections to Spring Boot backend
                if detections:
                    self._send_detections(detections)

                # Calculate FPS and throttle
                elapsed = time.time() - start_time
                self.fps = 1.0 / elapsed if elapsed > 0 else 0
                sleep_time = frame_delay - elapsed
                if sleep_time > 0:
                    time.sleep(sleep_time)

        except Exception as e:
            self.error = str(e)
            logger.error(f"Camera {self.camera_id} error: {e}")
        finally:
            self.is_running = False
            if self.cap:
                self.cap.release()

    def _send_detections(self, detections: list):
        """POST detection results to the Spring Boot backend."""
        try:
            ppe_ok = sum(1 for d in detections if d.ppe_compliant)
            payload = FrameDetections(
                camera_id=self.camera_id,
                timestamp=datetime.now().isoformat(),
                frame_number=self.frame_count,
                detections=detections,
                fps=round(self.fps, 1),
                total_persons=len(detections),
                ppe_compliant_count=ppe_ok,
                ppe_violation_count=len(detections) - ppe_ok,
            )
            requests.post(
                f"{settings.BACKEND_URL}/api/detections",
                json=payload.model_dump(),
                timeout=2
            )
        except requests.exceptions.RequestException as e:
            logger.debug(f"Failed to send detections: {e}")

    def get_status(self) -> CameraStatus:
        """Get current processing status."""
        return CameraStatus(
            camera_id=self.camera_id,
            is_running=self.is_running,
            fps=round(self.fps, 1),
            frame_count=self.frame_count,
            error=self.error
        )


class CameraManager:
    """Manages multiple camera streams."""

    def __init__(self):
        self.cameras: Dict[int, CameraStream] = {}
        self.lock = threading.Lock()

    def start_camera(self, camera_id: int, stream_url: str) -> CameraStatus:
        """Start processing a camera stream."""
        with self.lock:
            if camera_id in self.cameras:
                self.cameras[camera_id].stop()
            stream = CameraStream(camera_id, stream_url)
            self.cameras[camera_id] = stream
            stream.start()
            time.sleep(0.5)
            return stream.get_status()

    def stop_camera(self, camera_id: int) -> CameraStatus:
        """Stop processing a camera stream."""
        with self.lock:
            if camera_id not in self.cameras:
                return CameraStatus(camera_id=camera_id, is_running=False, error="Not found")
            self.cameras[camera_id].stop()
            status = self.cameras[camera_id].get_status()
            del self.cameras[camera_id]
            return status

    def get_all_status(self) -> list:
        """Get status of all cameras."""
        with self.lock:
            return [s.get_status() for s in self.cameras.values()]

    def get_frame(self, camera_id: int, annotated: bool = True):
        """Get the latest frame from a camera."""
        stream = self.cameras.get(camera_id)
        if stream is None:
            return None
        with stream.lock:
            if annotated and stream.annotated_frame is not None:
                return stream.annotated_frame.copy()
            elif stream.current_frame is not None:
                return stream.current_frame.copy()
        return None

    def stop_all(self):
        """Stop all camera streams."""
        with self.lock:
            for stream in self.cameras.values():
                stream.stop()
            self.cameras.clear()


camera_manager = CameraManager()
