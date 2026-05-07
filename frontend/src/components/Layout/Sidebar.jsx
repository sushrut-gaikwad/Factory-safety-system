import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Camera, Shield, History, AlertTriangle } from 'lucide-react';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/cameras', icon: Camera, label: 'Cameras' },
  { path: '/zones', icon: Shield, label: 'Zones' },
  { path: '/events', icon: History, label: 'Events' },
];

export default function Sidebar() {
  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>
        <div style={styles.logoIcon}><AlertTriangle size={22} color="#6366f1" /></div>
        <div>
          <div style={styles.logoTitle}>ThinkFlow</div>
          <div style={styles.logoSub}>v1.0</div>
        </div>
      </div>
      <nav style={styles.nav}>
        {navItems.map(item => (
          <NavLink key={item.path} to={item.path} end={item.path === '/'}
            style={({ isActive }) => ({
              ...styles.navItem,
              ...(isActive ? styles.navItemActive : {}),
            })}>
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div style={styles.footer}>
        <div style={styles.footerText}>Factory Safety System</div>
        <div style={styles.footerSub}>Offline Mode</div>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    position: 'fixed', left: 0, top: 0, bottom: 0, width: 'var(--sidebar-width)',
    background: 'linear-gradient(180deg, #0f172a 0%, #0a0e1a 100%)',
    borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column',
    zIndex: 100,
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: 12, padding: '20px 20px',
    borderBottom: '1px solid var(--border-color)',
  },
  logoIcon: {
    width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center',
    justifyContent: 'center', background: 'rgba(99,102,241,0.12)',
    border: '1px solid rgba(99,102,241,0.25)',
  },
  logoTitle: { fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' },
  logoSub: { fontSize: '0.7rem', color: 'var(--text-muted)' },
  nav: { flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 },
  navItem: {
    display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px',
    borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)',
    textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500,
    transition: 'all 0.2s ease',
  },
  navItemActive: {
    background: 'rgba(99,102,241,0.12)', color: '#818cf8',
    borderLeft: '3px solid #6366f1',
  },
  footer: { padding: '16px 20px', borderTop: '1px solid var(--border-color)' },
  footerText: { fontSize: '0.75rem', color: 'var(--text-muted)' },
  footerSub: { fontSize: '0.7rem', color: 'var(--text-muted)', opacity: 0.6, marginTop: 2 },
};
