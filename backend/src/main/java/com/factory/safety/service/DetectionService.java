package com.factory.safety.service;

import com.factory.safety.dto.AlertMessage;
import com.factory.safety.dto.DetectionPayload;
import com.factory.safety.model.Camera;
import com.factory.safety.model.Zone;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DetectionService {

    private static final Logger log = LoggerFactory.getLogger(DetectionService.class);

    private final ZoneService zoneService;
    private final AlertService alertService;
    private final EventService eventService;
    private final CameraService cameraService;
    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public DetectionService(ZoneService zoneService, AlertService alertService,
                            EventService eventService, CameraService cameraService,
                            SimpMessagingTemplate messagingTemplate) {
        this.zoneService = zoneService;
        this.alertService = alertService;
        this.eventService = eventService;
        this.cameraService = cameraService;
        this.messagingTemplate = messagingTemplate;
    }

    public void processDetections(DetectionPayload payload) {
        // Broadcast raw detections for live dashboard
        messagingTemplate.convertAndSend("/topic/detections", payload);

        if (payload.getDetections() == null || payload.getDetections().isEmpty()) {
            return;
        }

        Camera camera;
        try {
            camera = cameraService.findById(payload.getCameraId());
        } catch (Exception e) {
            log.debug("Camera not found for detection: {}", payload.getCameraId());
            return;
        }

        // --- PPE Violation Check ---
        int ppeViolations = 0;
        for (DetectionPayload.DetectionItem det : payload.getDetections()) {
            Boolean ppeOk = det.getPpeCompliant();
            if (ppeOk != null && !ppeOk) {
                ppeViolations++;
            }
        }
        if (ppeViolations > 0) {
            AlertMessage ppeAlert = new AlertMessage();
            ppeAlert.setType("PPE_VIOLATION");
            ppeAlert.setCameraId(camera.getId());
            ppeAlert.setCameraName(camera.getName());
            ppeAlert.setZoneId(0L);
            ppeAlert.setZoneName("PPE Check");
            ppeAlert.setSeverity("HIGH");
            ppeAlert.setPersonCount(ppeViolations);
            ppeAlert.setMessage(ppeViolations + " person(s) without proper PPE detected on " + camera.getName());
            ppeAlert.setTimestamp(LocalDateTime.now());
            alertService.triggerAlert(ppeAlert);

            try {
                eventService.logEvent(camera.getId(), null, "PPE_VIOLATION",
                        ppeViolations, "PPE violation detected", "HIGH");
            } catch (Exception e) {
                log.error("Failed to log PPE event: {}", e.getMessage());
            }
        }

        // --- Zone Breach Check ---
        List<Zone> activeZones = zoneService.findActiveByCamera(payload.getCameraId());
        if (activeZones.isEmpty()) {
            return;
        }

        boolean breachDetected = false;

        for (Zone zone : activeZones) {
            int breachCount = 0;

            for (DetectionPayload.DetectionItem det : payload.getDetections()) {
                if (isInsideZone(det.getBbox(), zone.getCoordinates())) {
                    breachCount++;
                }
            }

            if (breachCount > 0) {
                breachDetected = true;

                AlertMessage alert = new AlertMessage();
                alert.setType("ZONE_BREACH");
                alert.setCameraId(camera.getId());
                alert.setCameraName(camera.getName());
                alert.setZoneId(zone.getId());
                alert.setZoneName(zone.getName());
                alert.setSeverity(zone.getSeverity());
                alert.setPersonCount(breachCount);
                alert.setMessage(breachCount + " person(s) detected in danger zone: " + zone.getName());
                alert.setTimestamp(LocalDateTime.now());

                alertService.triggerAlert(alert);

                try {
                    String details = objectMapper.writeValueAsString(payload.getDetections());
                    eventService.logEvent(camera.getId(), zone.getId(), "ZONE_BREACH",
                            breachCount, details, zone.getSeverity());
                } catch (Exception e) {
                    log.error("Failed to log event: {}", e.getMessage());
                }
            }
        }

        if (!breachDetected && ppeViolations == 0 && "DANGER".equals(alertService.getSystemStatus())) {
            alertService.setSystemStatus("SAFE");
        }
    }

    private boolean isInsideZone(DetectionPayload.BboxData bbox, String coordinatesJson) {
        try {
            double centerX = bbox.getX() + bbox.getWidth() / 2;
            double centerY = bbox.getY() + bbox.getHeight() / 2;

            List<java.util.Map<String, Double>> points =
                    objectMapper.readValue(coordinatesJson,
                            objectMapper.getTypeFactory().constructCollectionType(
                                    List.class,
                                    objectMapper.getTypeFactory().constructMapType(
                                            java.util.Map.class, String.class, Double.class)));

            int n = points.size();
            boolean inside = false;
            for (int i = 0, j = n - 1; i < n; j = i++) {
                double xi = points.get(i).get("x"), yi = points.get(i).get("y");
                double xj = points.get(j).get("x"), yj = points.get(j).get("y");

                if ((yi > centerY) != (yj > centerY) &&
                        centerX < (xj - xi) * (centerY - yi) / (yj - yi) + xi) {
                    inside = !inside;
                }
            }
            return inside;
        } catch (Exception e) {
            log.error("Failed to check zone breach: {}", e.getMessage());
            return false;
        }
    }
}
