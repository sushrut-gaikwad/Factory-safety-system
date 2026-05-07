import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children, systemStatus, connected, alertCount, soundEnabled, onToggleSound, alarmActive, onDismissAlarm, onEmergencyStop }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <Header
        systemStatus={systemStatus}
        connected={connected}
        alertCount={alertCount}
        soundEnabled={soundEnabled}
        onToggleSound={onToggleSound}
        alarmActive={alarmActive}
        onDismissAlarm={onDismissAlarm}
        onEmergencyStop={onEmergencyStop}
      />
      <main className="main-content">
        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
}
