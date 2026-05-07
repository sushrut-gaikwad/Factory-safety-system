export const API_BASE = '/api';
export const AI_SERVICE_URL = 'http://localhost:5000';
export const WS_URL = '/ws';

export const SEVERITY_COLORS = {
  LOW: 'var(--info)',
  MEDIUM: 'var(--warning)',
  HIGH: 'var(--danger)',
  CRITICAL: 'var(--danger)'
};

export const STATUS_LABELS = {
  ACTIVE: { label: 'Active', class: 'badge-safe' },
  INACTIVE: { label: 'Inactive', class: 'badge-inactive' },
  ERROR: { label: 'Error', class: 'badge-danger' }
};
