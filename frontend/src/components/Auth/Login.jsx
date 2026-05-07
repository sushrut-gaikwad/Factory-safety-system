import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Eye, EyeOff, AlertTriangle } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.bg}></div>
      <div style={styles.card}>
        <div style={styles.logoWrap}>
          <div style={styles.logoCircle}><Shield size={32} color="#6366f1" /></div>
          <h1 style={styles.title}>ThinkFlow</h1>
          <p style={styles.subtitle}>Factory Safety Monitor</p>
        </div>
        {error && (
          <div style={styles.error}>
            <AlertTriangle size={16} /> {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input className="form-input" id="login-username" value={username}
              onChange={e => setUsername(e.target.value)} placeholder="Enter username" required />
          </div>
          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">Password</label>
            <input className="form-input" id="login-password" type={showPass ? 'text' : 'password'}
              value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" required />
            <button type="button" onClick={() => setShowPass(!showPass)}
              style={styles.eyeBtn}>
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <button type="submit" className="btn btn-primary" id="login-submit"
            style={{ width: '100%', marginTop: 8, justifyContent: 'center' }}
            disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p style={styles.hint}>Default: admin / admin123</p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden',
  },
  bg: {
    position: 'absolute', inset: 0,
    background: 'radial-gradient(ellipse at 30% 20%, rgba(99,102,241,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(239,68,68,0.08) 0%, transparent 60%)',
  },
  card: {
    position: 'relative', width: '100%', maxWidth: 400, padding: 36,
    background: 'var(--bg-card)', backdropFilter: 'blur(20px)',
    border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)',
    boxShadow: 'var(--shadow-lg)',
  },
  logoWrap: { textAlign: 'center', marginBottom: 28 },
  logoCircle: {
    width: 64, height: 64, borderRadius: '50%', margin: '0 auto 14px',
    background: 'rgba(99,102,241,0.12)', border: '2px solid rgba(99,102,241,0.3)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' },
  subtitle: { fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 2 },
  error: {
    display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px',
    background: 'var(--danger-bg)', border: '1px solid var(--danger-border)',
    borderRadius: 'var(--radius-sm)', color: 'var(--danger)', fontSize: '0.85rem',
    marginBottom: 16,
  },
  eyeBtn: {
    position: 'absolute', right: 12, top: 32, background: 'none', border: 'none',
    color: 'var(--text-muted)', cursor: 'pointer',
  },
  hint: { textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 20 },
};
