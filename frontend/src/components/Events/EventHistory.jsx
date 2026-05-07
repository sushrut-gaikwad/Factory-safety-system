import { useState, useEffect } from 'react';
import { getEvents, getCameras } from '../../services/api';
import { History, Filter } from 'lucide-react';

export default function EventHistory() {
  const [events, setEvents] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filterCamera, setFilterCamera] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => { getCameras().then(r => setCameras(r.data)).catch(() => {}); }, []);
  useEffect(() => { loadEvents(); }, [page, filterCamera, filterType]);

  const loadEvents = async () => {
    try {
      const params = { page, size: 15 };
      if (filterCamera) params.cameraId = filterCamera;
      if (filterType) params.eventType = filterType;
      const res = await getEvents(params);
      setEvents(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (e) {}
  };

  const getCameraName = (id) => cameras.find(c => c.id === id)?.name || `Camera ${id}`;
  const typeColor = { ZONE_BREACH: 'badge-danger', DETECTION: 'badge-info', ALERT_TRIGGERED: 'badge-warning' };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Event History</h1>
          <p className="page-subtitle">View past detection events and alerts</p>
        </div>
      </div>

      <div className="glass-card mb-4" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <Filter size={18} color="var(--text-muted)" />
        <select className="form-select" style={{ width: 200 }} value={filterCamera}
          onChange={e => { setFilterCamera(e.target.value); setPage(0); }}>
          <option value="">All Cameras</option>
          {cameras.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className="form-select" style={{ width: 200 }} value={filterType}
          onChange={e => { setFilterType(e.target.value); setPage(0); }}>
          <option value="">All Types</option>
          <option value="ZONE_BREACH">Zone Breach</option>
          <option value="DETECTION">Detection</option>
          <option value="ALERT_TRIGGERED">Alert Triggered</option>
        </select>
      </div>

      <div className="glass-card">
        {events.length === 0 ? (
          <div className="empty-state">
            <History size={48} style={{ opacity: 0.3 }} />
            <p className="empty-state-text">No events found</p>
          </div>
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr><th>Time</th><th>Camera</th><th>Type</th><th>Persons</th><th>Severity</th></tr>
              </thead>
              <tbody>
                {events.map(ev => (
                  <tr key={ev.id}>
                    <td className="mono" style={{ fontSize: '0.8rem' }}>
                      {new Date(ev.timestamp).toLocaleString()}
                    </td>
                    <td>{getCameraName(ev.cameraId)}</td>
                    <td><span className={`badge ${typeColor[ev.eventType] || 'badge-info'}`}>{ev.eventType}</span></td>
                    <td className="mono">{ev.personCount}</td>
                    <td>{ev.severity && <span className={`badge ${ev.severity === 'HIGH' || ev.severity === 'CRITICAL' ? 'badge-danger' : ev.severity === 'MEDIUM' ? 'badge-warning' : 'badge-info'}`}>{ev.severity}</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="pagination">
                <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>Prev</button>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Page {page + 1} of {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>Next</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
