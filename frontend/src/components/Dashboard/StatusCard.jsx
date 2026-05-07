export default function StatusCard({ icon, label, value, color, bg, pulse }) {
  return (
    <div className="glass-card" style={{
      display: 'flex', alignItems: 'center', gap: 16,
      animation: pulse ? 'pulse-danger 2s ease-in-out infinite' : 'none',
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12, display: 'flex',
        alignItems: 'center', justifyContent: 'center', background: bg, color: color,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase',
          letterSpacing: '0.5px', fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: '1.35rem', fontWeight: 700, color: color,
          fontFamily: 'var(--font-mono)', marginTop: 2 }}>{value}</div>
      </div>
    </div>
  );
}
