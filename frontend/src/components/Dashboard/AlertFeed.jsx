import { AlertTriangle, Clock } from 'lucide-react';

export default function AlertFeed({ alerts }) {
  const severityColor = { HIGH: 'var(--danger)', CRITICAL: 'var(--danger)', MEDIUM: 'var(--warning)', LOW: 'var(--info)' };

  return (
    <div className="glass-card" style={{ maxHeight: 500, display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16 }}>Live Alerts</h3>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {alerts.length === 0 ? (
          <div className="empty-state" style={{ padding: '30px 10px' }}>
            <p style={{ fontSize: '0.85rem' }}>No alerts — system is safe</p>
          </div>
        ) : (
          alerts.map((alert, i) => (
            <div key={i} className="slide-in" style={{
              ...styles.alertItem,
              borderLeftColor: severityColor[alert.severity] || 'var(--warning)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={14} color={severityColor[alert.severity]} />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {alert.zoneName}
                </span>
                <span className="badge badge-danger" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                  {alert.severity}
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '4px 0' }}>
                {alert.message}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                <Clock size={11} />
                {alert.timestamp ? new Date(alert.timestamp).toLocaleTimeString() : 'just now'}
                <span style={{ marginLeft: 8 }}>📷 {alert.cameraName}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  alertItem: {
    padding: '10px 12px', borderLeft: '3px solid', marginBottom: 8,
    background: 'rgba(30,41,59,0.4)', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
  },
};
