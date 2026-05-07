import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useWebSocket } from './hooks/useWebSocket';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import CameraManager from './components/Camera/CameraManager';
import ZoneManager from './components/Zone/ZoneManager';
import EventHistory from './components/Events/EventHistory';
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, color: '#ef4444', background: '#0a0e1a', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h2>Something went wrong</h2>
          <pre style={{ color: '#94a3b8', marginTop: 16 }}>{this.state.error?.toString()}</pre>
          <button onClick={() => window.location.reload()} style={{ marginTop: 20, padding: '10px 20px', background: '#6366f1', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const { user, loading } = useAuth();
  const ws = useWebSocket();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Layout
      systemStatus={ws.systemStatus}
      connected={ws.connected}
      alertCount={ws.alerts.length}
      soundEnabled={ws.soundEnabled}
      onToggleSound={() => ws.setSoundEnabled(!ws.soundEnabled)}
      alarmActive={ws.alarmActive}
      onDismissAlarm={ws.dismissAlarm}
      onEmergencyStop={ws.triggerEmergency}
    >
      <Routes>
        <Route path="/" element={
          <Dashboard
            systemStatus={ws.systemStatus}
            alerts={ws.alerts}
            detections={ws.detections}
            timeline={ws.timeline}
            alarmActive={ws.alarmActive}
            onDismissAlarm={ws.dismissAlarm}
            onEmergencyStop={ws.triggerEmergency}
            onClearAlerts={ws.clearAlerts}
          />
        } />
        <Route path="/cameras" element={<CameraManager detections={ws.detections} />} />
        <Route path="/zones" element={<ZoneManager />} />
        <Route path="/events" element={<EventHistory />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return <ErrorBoundary><AppContent /></ErrorBoundary>;
}
