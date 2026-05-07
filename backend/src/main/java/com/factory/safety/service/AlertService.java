package com.factory.safety.service;

import com.factory.safety.dto.AlertMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AlertService {

    private static final Logger log = LoggerFactory.getLogger(AlertService.class);

    private final SimpMessagingTemplate messagingTemplate;
    private final Map<Long, LocalDateTime> cooldownMap = new ConcurrentHashMap<>();
    private final List<AlertMessage> activeAlerts = Collections.synchronizedList(new ArrayList<>());
    private volatile String systemStatus = "SAFE";
    private long cooldownSeconds = 30;

    public AlertService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void setCooldownSeconds(long seconds) {
        this.cooldownSeconds = seconds;
    }

    public boolean isCooldownActive(Long zoneId) {
        LocalDateTime lastAlert = cooldownMap.get(zoneId);
        if (lastAlert == null) return false;
        return lastAlert.plusSeconds(cooldownSeconds).isAfter(LocalDateTime.now());
    }

    public void triggerAlert(AlertMessage alert) {
        if (isCooldownActive(alert.getZoneId())) {
            return;
        }

        cooldownMap.put(alert.getZoneId(), LocalDateTime.now());
        activeAlerts.add(alert);

        // Keep only last 100 alerts in memory
        while (activeAlerts.size() > 100) {
            activeAlerts.remove(0);
        }

        // Update system status
        systemStatus = "DANGER";

        // Broadcast via WebSocket
        messagingTemplate.convertAndSend("/topic/alerts", alert);
        broadcastStatus();

        log.warn("ALERT: {} in zone {} (camera {})",
                alert.getMessage(), alert.getZoneName(), alert.getCameraName());
    }

    public void broadcastStatus() {
        Map<String, String> statusMsg = Map.of("status", systemStatus);
        messagingTemplate.convertAndSend("/topic/status", statusMsg);
    }

    public List<AlertMessage> getActiveAlerts() {
        return new ArrayList<>(activeAlerts);
    }

    public String getSystemStatus() {
        return systemStatus;
    }

    public void setSystemStatus(String status) {
        this.systemStatus = status;
        broadcastStatus();
    }

    public void clearAlerts() {
        activeAlerts.clear();
        systemStatus = "SAFE";
        broadcastStatus();
    }
}
