"""Video frame processing utilities."""
import cv2
import numpy as np


def resize_frame(frame: np.ndarray, max_width: int = 640) -> np.ndarray:
    """Resize frame to max_width while maintaining aspect ratio."""
    h, w = frame.shape[:2]
    if w <= max_width:
        return frame
    scale = max_width / w
    new_w, new_h = int(w * scale), int(h * scale)
    return cv2.resize(frame, (new_w, new_h), interpolation=cv2.INTER_AREA)


def encode_frame_jpeg(frame: np.ndarray, quality: int = 70) -> bytes:
    """Encode a frame to JPEG bytes."""
    params = [cv2.IMWRITE_JPEG_QUALITY, quality]
    _, buffer = cv2.imencode('.jpg', frame, params)
    return buffer.tobytes()


def draw_zone_overlay(frame: np.ndarray, coordinates: list, color=(0, 0, 255), alpha=0.3):
    """Draw a semi-transparent polygon overlay for a danger zone."""
    if not coordinates or len(coordinates) < 3:
        return frame
    pts = np.array(coordinates, dtype=np.int32)
    overlay = frame.copy()
    cv2.fillPoly(overlay, [pts], color)
    return cv2.addWeighted(overlay, alpha, frame, 1 - alpha, 0)
