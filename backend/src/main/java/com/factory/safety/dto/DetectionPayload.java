package com.factory.safety.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class DetectionPayload {
    @JsonProperty("camera_id")
    private Long cameraId;
    private String timestamp;
    @JsonProperty("frame_number")
    private Integer frameNumber;
    private List<DetectionItem> detections;
    private Double fps;
    @JsonProperty("total_persons")
    private Integer totalPersons;
    @JsonProperty("ppe_compliant_count")
    private Integer ppeCompliantCount;
    @JsonProperty("ppe_violation_count")
    private Integer ppeViolationCount;

    public DetectionPayload() {}

    public Long getCameraId() { return cameraId; }
    public void setCameraId(Long cameraId) { this.cameraId = cameraId; }
    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
    public Integer getFrameNumber() { return frameNumber; }
    public void setFrameNumber(Integer frameNumber) { this.frameNumber = frameNumber; }
    public List<DetectionItem> getDetections() { return detections; }
    public void setDetections(List<DetectionItem> detections) { this.detections = detections; }
    public Double getFps() { return fps; }
    public void setFps(Double fps) { this.fps = fps; }
    public Integer getTotalPersons() { return totalPersons; }
    public void setTotalPersons(Integer totalPersons) { this.totalPersons = totalPersons; }
    public Integer getPpeCompliantCount() { return ppeCompliantCount; }
    public void setPpeCompliantCount(Integer ppeCompliantCount) { this.ppeCompliantCount = ppeCompliantCount; }
    public Integer getPpeViolationCount() { return ppeViolationCount; }
    public void setPpeViolationCount(Integer ppeViolationCount) { this.ppeViolationCount = ppeViolationCount; }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class DetectionItem {
        @JsonProperty("track_id")
        private Integer trackId;
        private Double confidence;
        private BboxData bbox;
        @JsonProperty("class_name")
        private String className;
        @JsonProperty("has_helmet")
        private Boolean hasHelmet;
        @JsonProperty("has_vest")
        private Boolean hasVest;
        @JsonProperty("ppe_compliant")
        private Boolean ppeCompliant;

        public DetectionItem() {}

        public Integer getTrackId() { return trackId; }
        public void setTrackId(Integer trackId) { this.trackId = trackId; }
        public Double getConfidence() { return confidence; }
        public void setConfidence(Double confidence) { this.confidence = confidence; }
        public BboxData getBbox() { return bbox; }
        public void setBbox(BboxData bbox) { this.bbox = bbox; }
        public String getClassName() { return className; }
        public void setClassName(String className) { this.className = className; }
        public Boolean getHasHelmet() { return hasHelmet; }
        public void setHasHelmet(Boolean hasHelmet) { this.hasHelmet = hasHelmet; }
        public Boolean getHasVest() { return hasVest; }
        public void setHasVest(Boolean hasVest) { this.hasVest = hasVest; }
        public Boolean getPpeCompliant() { return ppeCompliant; }
        public void setPpeCompliant(Boolean ppeCompliant) { this.ppeCompliant = ppeCompliant; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class BboxData {
        private Double x;
        private Double y;
        private Double width;
        private Double height;

        public BboxData() {}

        public Double getX() { return x; }
        public void setX(Double x) { this.x = x; }
        public Double getY() { return y; }
        public void setY(Double y) { this.y = y; }
        public Double getWidth() { return width; }
        public void setWidth(Double width) { this.width = width; }
        public Double getHeight() { return height; }
        public void setHeight(Double height) { this.height = height; }
    }
}
