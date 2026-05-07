import { useState, useEffect } from 'react';
import { getCameras, createCamera, updateCamera, deleteCamera, startDetection, stopDetection } from '../../services/api';
import { AI_SERVICE_URL } from '../../utils/constants';
import { Plus, Play, Square, Trash2, Edit, Camera, MapPin, Monitor, Video, Wifi, AlertCircle } from 'lucide-react';

const SOURCE_PRESETS = [
  { label: '💻 Laptop Webcam', value: '0', icon: Monitor },
  { label: '📷 USB Camera 2', value: '1', icon: Camera },
  { label: '🎥 Video File', value: '', icon: Video, custom: true, placeholder: 'C:\\path\\to\\video.mp4' },
  { label: '📡 IP Camera (RTSP)', value: '', icon: Wifi, custom: true, placeholder: 'rtsp://192.168.1.100:554/stream' },
];

export default function CameraManager() {
  const [cameras, setCameras] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', streamUrl: '0', location: '' });
  const [selectedPreset, setSelectedPreset] = useState(0);

  useEffect(() => { loadCameras(); }, []);

  const loadCameras = async () => {
    try { setCameras((await getCameras()).data); } catch (e) {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) await updateCamera(editing, form);
      else await createCamera(form);
      setShowForm(false); setEditing(null);
      setForm({ name: '', streamUrl: '0', location: '' }); setSelectedPreset(0);
      loadCameras();
    } catch (e) { alert('Error: ' + (e.response?.data?.message || e.message)); }
  };

  const handleEdit = (cam) => {
    setForm({ name: cam.name, streamUrl: cam.streamUrl, location: cam.location || '' });
    setEditing(cam.id); setShowForm(true); setSelectedPreset(-1);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this camera?')) return;
    try { await deleteCamera(id); loadCameras(); } catch (e) {}
  };

  const handleToggle = async (cam) => {
    try {
      if (cam.status === 'ACTIVE') await stopDetection(cam.id);
      else await startDetection(cam.id);
      setTimeout(loadCameras, 1000);
    } catch (e) { alert('Error toggling detection'); }
  };

  const selectPreset = (idx) => {
    setSelectedPreset(idx);
    const preset = SOURCE_PRESETS[idx];
    if (!preset.custom) setForm({ ...form, streamUrl: preset.value });
    else setForm({ ...form, streamUrl: '' });
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Camera Management</h1>
          <p className="page-subtitle">Configure and manage camera feeds</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowForm(true); setEditing(null); setForm({ name: '', streamUrl: '0', location: '' }); setSelectedPreset(0); }}>
          <Plus size={18} /> Add Camera
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <h3 className="modal-title">{editing ? 'Edit Camera' : 'Add Camera'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Camera Name</label>
                <input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Assembly Line Cam 1" required />
              </div>

              {!editing && (
                <div className="form-group">
                  <label className="form-label">Source Type</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                    {SOURCE_PRESETS.map((p, i) => (
                      <button key={i} type="button" onClick={() => selectPreset(i)}
                        style={{
                          padding: '10px 12px', borderRadius: 8, border: selectedPreset === i ? '2px solid #6366f1' : '1px solid var(--border-color)',
                          background: selectedPreset === i ? 'rgba(99,102,241,0.15)' : 'var(--bg-secondary)',
                          color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.82rem', textAlign: 'left',
                          transition: 'all 0.2s',
                        }}>
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {(editing || SOURCE_PRESETS[selectedPreset]?.custom) && (
                <div className="form-group">
                  <label className="form-label">Stream URL</label>
                  <input className="form-input" value={form.streamUrl} onChange={e => setForm({...form, streamUrl: e.target.value})}
                    placeholder={SOURCE_PRESETS[selectedPreset]?.placeholder || 'Enter stream URL'} required />
                </div>
              )}

              {!editing && !SOURCE_PRESETS[selectedPreset]?.custom && (
                <div style={{ padding: '10px 14px', background: 'rgba(99,102,241,0.08)', borderRadius: 8, border: '1px solid rgba(99,102,241,0.2)', marginBottom: 12 }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                    ✅ Will use <strong style={{ color: '#818cf8' }}>{SOURCE_PRESETS[selectedPreset]?.label}</strong> — Source: <code style={{ color: '#6366f1' }}>{form.streamUrl}</code>
                  </p>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Location (optional)</label>
                <input className="form-input" value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="e.g. Building A, Floor 2" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Add Camera'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {cameras.length === 0 ? (
        <div className="glass-card empty-state">
          <Camera size={48} style={{ opacity: 0.3 }} />
          <p className="empty-state-text">No cameras configured</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Click "Add Camera" and select your webcam to get started</p>
        </div>
      ) : (
        <div className="grid-2">
          {cameras.map(cam => (
            <div key={cam.id} className="glass-card">
              {/* Live preview */}
              {cam.status === 'ACTIVE' && (
                <div style={{ borderRadius: 8, overflow: 'hidden', marginBottom: 12, background: '#000', aspectRatio: '16/9', position: 'relative' }}>
                  <img src={`${AI_SERVICE_URL}/api/stream/${cam.id}`} alt={cam.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.style.display = 'none'; }} />
                  <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,0.6)', padding: '4px 10px', borderRadius: 12 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', animation: 'glow 1.5s ease-in-out infinite' }}></span>
                    <span style={{ fontSize: '0.7rem', color: 'white', fontWeight: 600 }}>LIVE</span>
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{cam.name}</h4>
                  {cam.location && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}><MapPin size={12} />{cam.location}</p>}
                </div>
                <span className={`badge ${cam.status === 'ACTIVE' ? 'badge-safe' : cam.status === 'ERROR' ? 'badge-danger' : 'badge-inactive'}`}>
                  {cam.status}
                </span>
              </div>
              <p className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 12, wordBreak: 'break-all' }}>
                Source: {cam.streamUrl === '0' ? '💻 Laptop Webcam' : cam.streamUrl === '1' ? '📷 USB Camera 2' : cam.streamUrl}
              </p>
              {cam.status === 'ERROR' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', background: 'var(--danger-bg)', border: '1px solid var(--danger-border)', borderRadius: 6, marginBottom: 12, fontSize: '0.78rem', color: 'var(--danger)' }}>
                  <AlertCircle size={14} /> Camera failed to connect. Check the source.
                </div>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <button className={`btn btn-sm ${cam.status === 'ACTIVE' ? 'btn-danger' : 'btn-success'}`} onClick={() => handleToggle(cam)}>
                  {cam.status === 'ACTIVE' ? <><Square size={14} /> Stop</> : <><Play size={14} /> Start</>}
                </button>
                <button className="btn-icon" onClick={() => handleEdit(cam)}><Edit size={14} /></button>
                <button className="btn-icon" onClick={() => handleDelete(cam.id)} style={{ color: 'var(--danger)' }}><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
