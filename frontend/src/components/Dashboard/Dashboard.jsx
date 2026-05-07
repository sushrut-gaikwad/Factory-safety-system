import { useState, useEffect } from 'react';
import { getCameras, getEventStats, getActiveAlerts, emergencyStopAll } from '../../services/api';
import StatusCard from './StatusCard';
import CameraGrid from './CameraGrid';
import AlertFeed from './AlertFeed';
import { Camera, Shield, Bell, Activity, Users, AlertOctagon, Clock, Zap } from 'lucide-react';

export default function Dashboard({ systemStatus, alerts, detections, timeline, alarmActive, onDismissAlarm, onEmergencyStop, onClearAlerts }) {
  const [cameras, setCameras] = useState([]);
  const [stats, setStats] = useState({ last24h: 0, lastHour: 0 });
  const [activeAlertCount, setActiveAlertCount] = useState(0);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [camRes, statsRes, alertRes] = await Promise.all([
        getCameras(), getEventStats(), getActiveAlerts()
      ]);
      setCameras(camRes.data instanceof Array ? camRes.data : [camRes.data].filter(Boolean));
      setStats(statsRes.data);
      setActiveAlertCount(alertRes.data.length);
    } catch (e) {}
  };

  const activeCams = (cameras || []).filter(c => c.status === 'ACTIVE').length;
  const totalPersons = Object.values(detections || {}).reduce((s, d) => s + (d.personCount || 0), 0);

  const handleEmergency = async () => {
    if (!confirm('⚠️ EMERGENCY STOP\n\nThis will halt all cameras and trigger a factory-wide alarm.\n\nContinue?')) return;
    try { await emergencyStopAll(); } catch(e) {}
    onEmergencyStop();
    loadData();
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Real-time factory safety overview</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {alerts.length > 0 && (
            <button className="btn btn-outline btn-sm" onClick={onClearAlerts}>Clear Alerts</button>
          )}
          <button className="btn btn-sm" onClick={handleEmergency}
            style={{ background: 'linear-gradient(135deg, #dc2626, #991b1b)', color: 'white', fontWeight: 700, gap: 6, display: 'flex', alignItems: 'center' }}>
            <AlertOctagon size={16} /> EMERGENCY STOP
          </button>
        </div>
      </div>

      {/* Alarm Banner */}
      {alarmActive && (
        <div className="glass-card mb-4" style={{ background: 'rgba(239,68,68,0.15)', border: '2px solid var(--danger)', animation: 'pulse-danger 1s infinite', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '1.8rem' }}>🚨</span>
            <div>
              <p style={{ fontWeight: 700, color: 'var(--danger)', fontSize: '1rem', margin: 0 }}>ALARM ACTIVE — Zone Breach Detected!</p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>Investigate immediately. Click "Dismiss" after resolving.</p>
            </div>
          </div>
          <button className="btn btn-danger btn-sm" onClick={onDismissAlarm}>Dismiss Alarm</button>
        </div>
      )}

      {/* Status Cards */}
      <div className="grid-4 mb-4" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        <StatusCard icon={<Activity size={22} />} label="System Status" value={systemStatus}
          color={systemStatus === 'DANGER' ? 'var(--danger)' : 'var(--safe)'}
          bg={systemStatus === 'DANGER' ? 'var(--danger-bg)' : 'var(--safe-bg)'} pulse={systemStatus === 'DANGER'} />
        <StatusCard icon={<Camera size={22} />} label="Active Cameras" value={`${activeCams} / ${(cameras || []).length}`}
          color="var(--info)" bg="var(--info-bg)" />
        <StatusCard icon={<Users size={22} />} label="Persons Detected" value={totalPersons}
          color="var(--accent)" bg="var(--accent-bg)" />
        <StatusCard icon={<Bell size={22} />} label="Active Alerts" value={activeAlertCount}
          color="var(--warning)" bg="var(--warning-bg)" />
        <StatusCard icon={<Shield size={22} />} label="Events (24h)" value={stats.last24h}
          color="var(--info)" bg="var(--info-bg)" />
      </div>

      {/* Main Grid: Cameras + Alerts + Timeline */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
        <div>
          <CameraGrid cameras={(cameras || []).filter(c => c.status === 'ACTIVE')} detections={detections} />

          {/* Live Camera Stats */}
          {activeCams > 0 && (
            <div className="glass-card mt-4">
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Zap size={16} color="var(--warning)" /> Live Camera Stats
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                {(cameras || []).filter(c => c.status === 'ACTIVE').map(cam => {
                  const det = (detections || {})[cam.id];
                  return (
                    <div key={cam.id} style={{ padding: 12, background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--border-color)' }}>
                      <p style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: 6 }}>{cam.name}</p>
                      <div style={{ display: 'flex', gap: 16 }}>
                        <div>
                          <p className="mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent)' }}>{det?.personCount || 0}</p>
                          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Persons</p>
                        </div>
                        <div>
                          <p className="mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--safe)' }}>{det?.fps || 0}</p>
                          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>FPS</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <AlertFeed alerts={alerts} />

          {/* Activity Timeline */}
          <div className="glass-card" style={{ maxHeight: 320, overflow: 'auto' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={16} color="var(--info)" /> Activity Timeline
            </h3>
            {(timeline || []).length === 0 ? (
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center', padding: 20 }}>No activity yet. Start a camera and create zones to see events.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {(timeline || []).slice(0, 20).map((item, i) => (
                  <div key={i} className="slide-in" style={{ padding: '8px 12px', borderLeft: `3px solid ${item.type === 'emergency' ? 'var(--danger)' : item.severity === 'CRITICAL' ? '#ef4444' : item.severity === 'HIGH' ? '#f59e0b' : '#6366f1'}`, background: 'var(--bg-secondary)', borderRadius: '0 6px 6px 0', fontSize: '0.78rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {item.type === 'emergency' ? '🚨' : '⚠️'} {item.zoneName || 'System'}
                      </span>
                      <span className="mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                        {new Date(item.ts).toLocaleTimeString()}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', margin: '2px 0 0', fontSize: '0.74rem' }}>{item.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
