package com.factory.safety.dto;

import jakarta.validation.constraints.NotBlank;

public class CameraDTO {
    @NotBlank(message = "Name is required")
    private String name;
    @NotBlank(message = "Stream URL is required")
    private String streamUrl;
    private String location;

    public CameraDTO() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getStreamUrl() { return streamUrl; }
    public void setStreamUrl(String streamUrl) { this.streamUrl = streamUrl; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}
