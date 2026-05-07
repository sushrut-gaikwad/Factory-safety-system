import { useEffect, useRef, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';

export function useWebSocket() {
  const [alerts, setAlerts] = useState([]);
  const [systemStatus, setSystemStatus] = useState('SAFE');
  const [connected, setConnected] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [alarmActive, setAlarmActive] = useState(false);
  const [detections, setDetections] = useState({});
  const [timeline, setTimeline] = useState([]);
  const clientRef = useRef(null);
  const audioCtxRef = useRef(null);
  const alarmIntervalRef = useRef(null);
  const alarmCooldownRef = useRef(false);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const showPushNotification = useCallback((alert) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        const n = new Notification('⚠️ ThinkFlow Safety Alert', {
          body: `${alert.message}\nZone: ${alert.zoneName} | Camera: ${alert.cameraName}`,
          icon: '🚨',
          tag: 'zone-breach-' + alert.zoneId,
          requireInteraction: true,
        });
        n.onclick = () => { window.focus(); n.close(); };
        setTimeout(() => n.close(), 15000);
      } catch (e) {}
    }
  }, []);

  const startAlarm = useCallback(() => {
    if (!soundEnabled || alarmIntervalRef.current || alarmCooldownRef.current) return;
    setAlarmActive(true);
    const playBeep = () => {
      try {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
          audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') ctx.resume();
        // Siren: rising then falling
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sawtooth';
        const now = ctx.currentTime;
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.linearRampToValueAtTime(880, now + 0.3);
        osc.frequency.linearRampToValueAtTime(440, now + 0.6);
        osc.frequency.linearRampToValueAtTime(880, now + 0.9);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.05, now + 1.0);
        osc.start(now);
        osc.stop(now + 1.0);
      } catch (e) {}
    };
    playBeep();
    alarmIntervalRef.current = setInterval(playBeep, 1500);
  }, [soundEnabled]);

  const dismissAlarm = useCallback(() => {
    setAlarmActive(false);
    if (alarmIntervalRef.current) {
      clearInterval(alarmIntervalRef.current);
      alarmIntervalRef.current = null;
    }
    // 60-second cooldown so alarm doesn't immediately re-trigger
    alarmCooldownRef.current = true;
    setTimeout(() => { alarmCooldownRef.current = false; }, 60000);
  }, []);

  useEffect(() => {
    let client;
    try {
      client = new Client({
        brokerURL: `ws://${window.location.hostname}:8080/ws/websocket`,
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          setConnected(true);

          // Alert subscription
          client.subscribe('/topic/alerts', (msg) => {
            try {
              const alert = JSON.parse(msg.body);
              setAlerts((prev) => [alert, ...prev].slice(0, 100));
              setTimeline((prev) => [{ ...alert, ts: Date.now(), type: 'alert' }, ...prev].slice(0, 50));
              startAlarm();
              showPushNotification(alert);
            } catch (e) {}
          });

          // Status subscription
          client.subscribe('/topic/status', (msg) => {
            try {
              const data = JSON.parse(msg.body);
              setSystemStatus(data.status);
              if (data.status === 'SAFE') dismissAlarm();
            } catch (e) {}
          });

          // Detection data subscription (live person counts)
          client.subscribe('/topic/detections', (msg) => {
            try {
              const data = JSON.parse(msg.body);
              setDetections((prev) => ({
                ...prev,
                [data.cameraId || data.camera_id]: {
                  personCount: (data.detections || []).length,
                  fps: data.fps || 0,
                  timestamp: Date.now(),
                },
              }));
            } catch (e) {}
          });
        },
        onDisconnect: () => setConnected(false),
        onStompError: () => setConnected(false),
        onWebSocketError: () => setConnected(false),
      });
      client.activate();
      clientRef.current = client;
    } catch (e) {
      console.warn('WebSocket connection failed:', e);
    }

    return () => {
      try { if (client) client.deactivate(); } catch (e) {}
      dismissAlarm();
    };
  }, [startAlarm, dismissAlarm, showPushNotification]);

  const clearAlerts = () => { setAlerts([]); dismissAlarm(); };

  const triggerEmergency = useCallback(() => {
    startAlarm();
    setSystemStatus('DANGER');
    const emergencyAlert = {
      type: 'EMERGENCY',
      message: '🚨 EMERGENCY STOP ACTIVATED — All cameras halted',
      zoneName: 'ALL ZONES',
      cameraName: 'SYSTEM',
      severity: 'CRITICAL',
      personCount: 0,
      timestamp: new Date().toISOString(),
    };
    setAlerts((prev) => [emergencyAlert, ...prev]);
    setTimeline((prev) => [{ ...emergencyAlert, ts: Date.now(), type: 'emergency' }, ...prev].slice(0, 50));
    showPushNotification(emergencyAlert);
  }, [startAlarm, showPushNotification]);

  return {
    alerts, systemStatus, connected, soundEnabled, setSoundEnabled,
    clearAlerts, alarmActive, dismissAlarm, detections, timeline,
    triggerEmergency,
  };
}
