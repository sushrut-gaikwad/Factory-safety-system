import { useAuth } from '../../context/AuthContext';
import { Bell, Wifi, WifiOff, Volume2, VolumeX, LogOut, AlertOctagon, XCircle } from 'lucide-react';

export default function Header({ systemStatus, connected, alertCount, soundEnabled, onToggleSound, alarmActive, onDismissAlarm, onEmergencyStop }) {
  const { user, logout } = useAuth();

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <div className={`badge ${systemStatus === 'DANGER' ? 'badge-danger' : 'badge-safe'}`}
          style={{ fontSize: '0.8rem', padding: '6px 16px' }}>
          {systemStatus === 'DANGER' ? '⚠ DANGER' : '✓ SAFE'}
        </div>
        {alarmActive && (
          <button onClick={onDismissAlarm}
            style={{ padding: '6px 16px', background: 'var(--danger)', color: 'white', border: 'none', borderRadius: 8, fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', animation: 'pulse-danger 1s infinite', display: 'flex', alignItems: 'center', gap: 6 }}>
            <XCircle size={14} /> DISMISS ALARM
          </button>
        )}
      </div>
      <div style={styles.right}>
        <button className="btn-icon" onClick={onEmergencyStop} title="Emergency Stop"
          style={{ color: '#ef4444', border: '1px solid rgba(239,68,68,0.4)' }}>
          <AlertOctagon size={18} />
        </button>
        <button className="btn-icon" onClick={onToggleSound} title={soundEnabled ? 'Mute alerts' : 'Unmute alerts'}>
          {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
        <div style={styles.connBadge}>
          {connected ? <Wifi size={14} color="var(--safe)" /> : <WifiOff size={14} color="var(--danger)" />}
          <span style={{ fontSize: '0.75rem', color: connected ? 'var(--safe)' : 'var(--danger)' }}>
            {connected ? 'Live' : 'Offline'}
          </span>
        </div>
        {alertCount > 0 && (
          <div style={styles.alertBadge}>
            <Bell size={16} />
            <span style={styles.alertCount}>{alertCount > 99 ? '99+' : alertCount}</span>
          </div>
        )}
        <div style={styles.userInfo}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{user?.username}</span>
          <button className="btn-icon" onClick={logout} title="Logout"><LogOut size={16} /></button>
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    position: 'fixed', top: 0, right: 0, left: 'var(--sidebar-width)', height: 'var(--header-height)',
    background: 'rgba(10, 14, 26, 0.85)', backdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', padding: '0 28px', zIndex: 99,
  },
  left: { display: 'flex', alignItems: 'center', gap: 12 },
  right: { display: 'flex', alignItems: 'center', gap: 14 },
  connBadge: { display: 'flex', alignItems: 'center', gap: 6 },
  alertBadge: { position: 'relative', color: 'var(--warning)' },
  alertCount: {
    position: 'absolute', top: -6, right: -8, background: 'var(--danger)',
    color: 'white', fontSize: '0.65rem', fontWeight: 700, borderRadius: '50%',
    width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  userInfo: { display: 'flex', alignItems: 'center', gap: 8, marginLeft: 8 },
};
