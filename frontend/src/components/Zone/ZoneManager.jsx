import { useState, useEffect } from 'react';
import { getZones, getCameras, createZone, deleteZone, toggleZone } from '../../services/api';
import { Plus, Trash2, Shield, ToggleLeft, ToggleRight, PenTool } from 'lucide-react';
import ZoneDrawer from './ZoneDrawer';

export default function ZoneManager() {
  const [zones, setZones] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [drawingStep, setDrawingStep] = useState('form'); // 'form' or 'draw'
  const [form, setForm] = useState({ name: '', cameraId: '', zoneType: 'FIXED', coordinates: '', severity: 'HIGH' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [zRes, cRes] = await Promise.all([getZones(), getCameras()]);
      setZones(zRes.data); setCameras(cRes.data);
    } catch (e) {}
  };

  const openForm = () => {
    setForm({ name: '', cameraId: '', zoneType: 'FIXED', coordinates: '', severity: 'HIGH' });
    setDrawingStep('form');
    setShowForm(true);
  };

  const goToDraw = (e) => {
    e.preventDefault();
    if (!form.name || !form.cameraId) {
      alert('Please fill in zone name and select a camera');
      return;
    }
    setDrawingStep('draw');
  };

  const handleDrawSave = async (points) => {
    try {
      const coords = JSON.stringify(points);
      await createZone({ ...form, cameraId: Number(form.cameraId), coordinates: coords });
      setShowForm(false);
      setForm({ name: '', cameraId: '', zoneType: 'FIXED', coordinates: '', severity: 'HIGH' });
      loadData();
    } catch (e) {
      alert('Error: ' + (e.response?.data?.message || e.message));
    }
  };

  const handleToggle = async (id) => {
    try { await toggleZone(id); loadData(); } catch (e) {}
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this zone?')) return;
    try { await deleteZone(id); loadData(); } catch (e) {}
  };

  const getCameraName = (id) => cameras.find(c => c.id === id)?.name || `Camera ${id}`;
  const sevColor = { LOW: 'badge-info', MEDIUM: 'badge-warning', HIGH: 'badge-danger', CRITICAL: 'badge-danger' };

  const activeCameras = cameras.filter(c => c.status === 'ACTIVE');

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Zone Management</h1>
          <p className="page-subtitle">Draw danger zones on camera feeds</p>
        </div>
        <button className="btn btn-primary" onClick={openForm}>
          <Plus size={18} /> Add Zone
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}
            style={{ maxWidth: drawingStep === 'draw' ? 720 : 440 }}>

            {drawingStep === 'form' ? (
              <>
                <h3 className="modal-title">
                  <PenTool size={20} style={{ marginRight: 8 }} /> Create Danger Zone
                </h3>
                <form onSubmit={goToDraw}>
                  <div className="form-group">
                    <label className="form-label">Zone Name</label>
                    <input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Restricted Machine Area" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Camera</label>
                    {cameras.length === 0 ? (
                      <p style={{ fontSize: '0.82rem', color: 'var(--warning)', margin: '8px 0' }}>⚠ No cameras found. Add a camera first.</p>
                    ) : (
                      <select className="form-select" value={form.cameraId} onChange={e => setForm({...form, cameraId: e.target.value})} required>
                        <option value="">Select camera...</option>
                        {cameras.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.name} {c.status === 'ACTIVE' ? '🟢' : '⚫'}
                          </option>
                        ))}
                      </select>
                    )}
                    {form.cameraId && !activeCameras.find(c => c.id === Number(form.cameraId)) && (
                      <p style={{ fontSize: '0.78rem', color: 'var(--warning)', marginTop: 6 }}>
                        💡 Start this camera first to see the live feed while drawing the zone.
                      </p>
                    )}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="form-group">
                      <label className="form-label">Zone Type</label>
                      <select className="form-select" value={form.zoneType} onChange={e => setForm({...form, zoneType: e.target.value})}>
                        <option value="FIXED">Fixed</option>
                        <option value="TRACKING">Tracking</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Severity</label>
                      <select className="form-select" value={form.severity} onChange={e => setForm({...form, severity: e.target.value})}>
                        <option value="LOW">🟢 Low</option>
                        <option value="MEDIUM">🟡 Medium</option>
                        <option value="HIGH">🔴 High</option>
                        <option value="CRITICAL">⛔ Critical</option>
                      </select>
                    </div>
                  </div>
                  <div className="modal-actions">
                    <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary">
                      <PenTool size={16} /> Draw Zone →
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h3 className="modal-title">
                  <PenTool size={20} style={{ marginRight: 8 }} /> Draw Zone: {form.name}
                </h3>
                <ZoneDrawer
                  cameraId={Number(form.cameraId)}
                  onSave={handleDrawSave}
                  onCancel={() => setDrawingStep('form')}
                />
              </>
            )}
          </div>
        </div>
      )}

      {zones.length === 0 ? (
        <div className="glass-card empty-state">
          <Shield size={48} style={{ opacity: 0.3 }} />
          <p className="empty-state-text">No danger zones configured</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Draw zones on camera feeds to start monitoring for intrusions</p>
        </div>
      ) : (
        <div className="glass-card">
          <table className="data-table">
            <thead>
              <tr><th>Zone</th><th>Camera</th><th>Type</th><th>Severity</th><th>Points</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {zones.map(z => {
                let pointCount = 0;
                try { pointCount = JSON.parse(z.coordinates).length; } catch(e) {}
                return (
                  <tr key={z.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{z.name}</td>
                    <td>{getCameraName(z.cameraId)}</td>
                    <td><span className="badge badge-info">{z.zoneType}</span></td>
                    <td><span className={`badge ${sevColor[z.severity]}`}>{z.severity}</span></td>
                    <td><span className="mono" style={{ fontSize: '0.8rem' }}>{pointCount} pts</span></td>
                    <td><span className={`badge ${z.isActive ? 'badge-safe' : 'badge-inactive'}`}>{z.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td style={{ display: 'flex', gap: 8 }}>
                      <button className="btn-icon" onClick={() => handleToggle(z.id)} title="Toggle active">
                        {z.isActive ? <ToggleRight size={18} color="var(--safe)" /> : <ToggleLeft size={18} />}
                      </button>
                      <button className="btn-icon" onClick={() => handleDelete(z.id)} style={{ color: 'var(--danger)' }}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
