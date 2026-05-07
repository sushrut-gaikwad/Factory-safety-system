import axios from 'axios';
import { API_BASE } from '../utils/constants';

const api = axios.create({ baseURL: API_BASE });

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);

// Cameras
export const getCameras = () => api.get('/cameras');
export const createCamera = (data) => api.post('/cameras', data);
export const updateCamera = (id, data) => api.put(`/cameras/${id}`, data);
export const deleteCamera = (id) => api.delete(`/cameras/${id}`);
export const startDetection = (id) => api.post(`/cameras/${id}/start`);
export const stopDetection = (id) => api.post(`/cameras/${id}/stop`);
export const emergencyStopAll = () => api.post('/cameras/emergency-stop');

// Zones
export const getZones = () => api.get('/zones');
export const createZone = (data) => api.post('/zones', data);
export const updateZone = (id, data) => api.put(`/zones/${id}`, data);
export const deleteZone = (id) => api.delete(`/zones/${id}`);
export const toggleZone = (id) => api.put(`/zones/${id}/toggle`);

// Events
export const getEvents = (params) => api.get('/events', { params });
export const getEventStats = () => api.get('/events/stats');

// Alerts
export const getActiveAlerts = () => api.get('/alerts/active');
export const getSystemStatus = () => api.get('/alerts/status');
export const clearAlerts = () => api.post('/alerts/clear');

export default api;
