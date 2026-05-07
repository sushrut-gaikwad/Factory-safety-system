import { AI_SERVICE_URL } from '../../utils/constants';
import { VideoOff, Users } from 'lucide-react';

export default function CameraGrid({ cameras, detections }) {
  if (cameras.length === 0) {
    return (
      <div className="glass-card">
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16 }}>Live Feeds</h3>
        <div className="empty-state">
          <VideoOff size={48} style={{ opacity: 0.3 }} />
          <p className="empty-state-text">No active cameras</p>
          <p style={{ fontSize: '0.8rem' }}>Start detection on a camera to see live feed</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card">
      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16 }}>Live Feeds</h3>
      <div style={{ display: 'grid', gridTemplateColumns: cameras.length === 1 ? '1fr' : 'repeat(2, 1fr)', gap: 12 }}>
        {cameras.map(cam => {
          const det = (detections || {})[cam.id];
          return (
            <div key={cam.id} style={styles.feedCard}>
              <img src={`${AI_SERVICE_URL}/api/stream/${cam.id}`} alt={cam.name}
                style={styles.feedImg}
                onError={(e) => { e.target.style.display = 'none'; }} />
              <div style={styles.feedLabel}>
                <span style={styles.liveDot}></span>
                {cam.name}
              </div>
              {/* Person count overlay */}
              <div style={styles.statsOverlay}>
                <div style={styles.statBadge}>
                  <Users size={12} />
                  <span style={{ fontWeight: 700 }}>{det?.personCount || 0}</span>
                </div>
                <div style={{ ...styles.statBadge, background: 'rgba(34,197,94,0.8)' }}>
                  {det?.fps || 0} FPS
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  feedCard: {
    position: 'relative', borderRadius: 'var(--radius-sm)', overflow: 'hidden',
    background: '#000', aspectRatio: '16/10',
  },
  feedImg: {
    width: '100%', height: '100%', objectFit: 'cover',
  },
  feedLabel: {
    position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px 12px',
    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
    fontSize: '0.8rem', color: 'white', display: 'flex', alignItems: 'center', gap: 8,
  },
  liveDot: {
    width: 8, height: 8, borderRadius: '50%', background: '#ef4444',
    animation: 'glow 1.5s ease-in-out infinite',
  },
  statsOverlay: {
    position: 'absolute', top: 8, right: 8, display: 'flex', gap: 6,
  },
  statBadge: {
    background: 'rgba(99,102,241,0.85)', color: 'white', padding: '3px 8px',
    borderRadius: 6, fontSize: '0.7rem', fontWeight: 600,
    display: 'flex', alignItems: 'center', gap: 4,
  },
};
