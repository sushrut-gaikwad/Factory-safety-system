package com.factory.safety.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "camera_id", nullable = false)
    private Long cameraId;

    @Column(name = "zone_id")
    private Long zoneId;

    @Column(name = "event_type", nullable = false, length = 50)
    private String eventType;

    @Column(name = "person_count")
    private Integer personCount = 0;

    @Column(columnDefinition = "TEXT")
    private String details;

    @Column(length = 20)
    private String severity;

    @Column(name = "timestamp")
    private LocalDateTime timestamp = LocalDateTime.now();

    public Event() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getCameraId() { return cameraId; }
    public void setCameraId(Long cameraId) { this.cameraId = cameraId; }
    public Long getZoneId() { return zoneId; }
    public void setZoneId(Long zoneId) { this.zoneId = zoneId; }
    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }
    public Integer getPersonCount() { return personCount; }
    public void setPersonCount(Integer personCount) { this.personCount = personCount; }
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
