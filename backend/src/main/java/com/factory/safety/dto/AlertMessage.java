package com.factory.safety.dto;

import java.time.LocalDateTime;

public class AlertMessage {
    private String type;
    private Long cameraId;
    private String cameraName;
    private Long zoneId;
    private String zoneName;
    private String severity;
    private Integer personCount;
    private String message;
    private LocalDateTime timestamp;

    public AlertMessage() {}

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Long getCameraId() { return cameraId; }
    public void setCameraId(Long cameraId) { this.cameraId = cameraId; }
    public String getCameraName() { return cameraName; }
    public void setCameraName(String cameraName) { this.cameraName = cameraName; }
    public Long getZoneId() { return zoneId; }
    public void setZoneId(Long zoneId) { this.zoneId = zoneId; }
    public String getZoneName() { return zoneName; }
    public void setZoneName(String zoneName) { this.zoneName = zoneName; }
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
    public Integer getPersonCount() { return personCount; }
    public void setPersonCount(Integer personCount) { this.personCount = personCount; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
