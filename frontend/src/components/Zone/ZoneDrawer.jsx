import { useRef, useState, useEffect, useCallback } from 'react';
import { AI_SERVICE_URL } from '../../utils/constants';

export default function ZoneDrawer({ cameraId, onSave, onCancel, initialPoints }) {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [points, setPoints] = useState(initialPoints || []);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgSize, setImgSize] = useState({ w: 640, h: 480 });

  // Load a snapshot from the camera feed
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imgRef.current = img;
      setImgSize({ w: img.naturalWidth || 640, h: img.naturalHeight || 480 });
      setImgLoaded(true);
    };
    img.onerror = () => {
      setImgLoaded(true); // draw blank canvas
    };
    img.src = `${AI_SERVICE_URL}/api/stream/${cameraId}`;
    // For MJPEG, grab a single frame via a timeout fallback
    const timeout = setTimeout(() => setImgLoaded(true), 2000);
    return () => clearTimeout(timeout);
  }, [cameraId]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Draw background
    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw camera frame placeholder
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      try { ctx.drawImage(imgRef.current, 0, 0, canvas.width, canvas.height); } catch(e) {}
    } else {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#64748b';
      ctx.font = '16px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Click to place zone boundary points', canvas.width / 2, canvas.height / 2 - 10);
      ctx.font = '13px Inter, sans-serif';
      ctx.fillText('(Camera feed may take a moment to load)', canvas.width / 2, canvas.height / 2 + 15);
    }

    // Draw dark overlay
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (points.length === 0) return;

    const scaleX = canvas.width / imgSize.w;
    const scaleY = canvas.height / imgSize.h;

    // Draw filled polygon
    if (points.length >= 3) {
      ctx.beginPath();
      ctx.moveTo(points[0].x * scaleX, points[0].y * scaleY);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x * scaleX, points[i].y * scaleY);
      }
      ctx.closePath();
      ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
      ctx.fill();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.stroke();
    }

    // Draw lines
    if (points.length >= 2) {
      ctx.beginPath();
      ctx.moveTo(points[0].x * scaleX, points[0].y * scaleY);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x * scaleX, points[i].y * scaleY);
      }
      if (points.length < 3) {
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.stroke();
      }
    }

    // Draw points
    points.forEach((p, i) => {
      const px = p.x * scaleX, py = p.y * scaleY;
      // Outer ring
      ctx.beginPath();
      ctx.arc(px, py, 8, 0, Math.PI * 2);
      ctx.fillStyle = i === 0 ? '#22c55e' : '#ef4444';
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.stroke();
      // Label
      ctx.fillStyle = 'white';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(String(i + 1), px, py + 4);
    });
  }, [points, imgSize]);

  useEffect(() => { draw(); }, [draw, imgLoaded]);

  const handleClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    // Convert to image coordinates
    const x = Math.round((clickX / rect.width) * imgSize.w);
    const y = Math.round((clickY / rect.height) * imgSize.h);
    setPoints(prev => [...prev, { x, y }]);
  };

  const undoLast = () => setPoints(prev => prev.slice(0, -1));
  const clearAll = () => setPoints([]);

  const handleSave = () => {
    if (points.length < 3) {
      alert('Please place at least 3 points to form a zone');
      return;
    }
    onSave(points);
  };

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 8px' }}>
          👆 <strong>Click on the image</strong> to place boundary points. Place at least 3 points to form a danger zone polygon.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span className="badge badge-info" style={{ fontSize: '0.75rem' }}>Points: {points.length}</span>
          {points.length >= 3 && <span className="badge badge-safe" style={{ fontSize: '0.75rem' }}>✓ Valid Zone</span>}
          {points.length > 0 && points.length < 3 && <span className="badge badge-warning" style={{ fontSize: '0.75rem' }}>Need {3 - points.length} more</span>}
        </div>
      </div>

      <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', border: '2px solid var(--border-color)', cursor: 'crosshair' }}>
        <canvas
          ref={canvasRef}
          onClick={handleClick}
          style={{ width: '100%', aspectRatio: '640/480', display: 'block' }}
        />
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button type="button" className="btn btn-outline btn-sm" onClick={undoLast} disabled={points.length === 0}>
          ↩ Undo
        </button>
        <button type="button" className="btn btn-outline btn-sm" onClick={clearAll} disabled={points.length === 0}>
          ✕ Clear
        </button>
        <div style={{ flex: 1 }} />
        <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
        <button type="button" className="btn btn-primary" onClick={handleSave} disabled={points.length < 3}>
          ✓ Save Zone
        </button>
      </div>
    </div>
  );
}
