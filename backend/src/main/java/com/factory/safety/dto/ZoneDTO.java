package com.factory.safety.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ZoneDTO {
    @NotBlank(message = "Name is required")
    private String name;
    @NotNull(message = "Camera ID is required")
    private Long cameraId;
    private String zoneType = "FIXED";
    @NotBlank(message = "Coordinates are required")
    private String coordinates;
    private String severity = "HIGH";

    public ZoneDTO() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Long getCameraId() { return cameraId; }
    public void setCameraId(Long cameraId) { this.cameraId = cameraId; }
    public String getZoneType() { return zoneType; }
    public void setZoneType(String zoneType) { this.zoneType = zoneType; }
    public String getCoordinates() { return coordinates; }
    public void setCoordinates(String coordinates) { this.coordinates = coordinates; }
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
}
