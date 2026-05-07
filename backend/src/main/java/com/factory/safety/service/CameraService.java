package com.factory.safety.service;

import com.factory.safety.dto.CameraDTO;
import com.factory.safety.exception.ResourceNotFoundException;
import com.factory.safety.model.Camera;
import com.factory.safety.repository.CameraRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CameraService {

    private static final Logger log = LoggerFactory.getLogger(CameraService.class);

    private final CameraRepository cameraRepository;
    private final RestTemplate restTemplate;

    @Value("${app.ai-service-url}")
    private String aiServiceUrl;

    public CameraService(CameraRepository cameraRepository) {
        this.cameraRepository = cameraRepository;
        this.restTemplate = new RestTemplate();
    }

    public List<Camera> findAll() {
        return cameraRepository.findAll();
    }

    public Camera findById(Long id) {
        return cameraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Camera not found: " + id));
    }

    public Camera create(CameraDTO dto) {
        Camera camera = new Camera();
        camera.setName(dto.getName());
        camera.setStreamUrl(dto.getStreamUrl().replace("\"", "").trim());
        camera.setLocation(dto.getLocation());
        return cameraRepository.save(camera);
    }

    public Camera update(Long id, CameraDTO dto) {
        Camera camera = findById(id);
        camera.setName(dto.getName());
        camera.setStreamUrl(dto.getStreamUrl().replace("\"", "").trim());
        camera.setLocation(dto.getLocation());
        return cameraRepository.save(camera);
    }

    public void delete(Long id) {
        Camera camera = findById(id);
        if ("ACTIVE".equals(camera.getStatus())) {
            stopDetection(id);
        }
        cameraRepository.delete(camera);
    }

    public Camera startDetection(Long id) {
        Camera camera = findById(id);
        try {
            Map<String, Object> body = new HashMap<>();
            body.put("camera_id", camera.getId());
            body.put("stream_url", camera.getStreamUrl());
            restTemplate.postForEntity(aiServiceUrl + "/api/cameras/start", body, String.class);
            camera.setStatus("ACTIVE");
            log.info("Started detection for camera: {}", camera.getName());
        } catch (Exception e) {
            camera.setStatus("ERROR");
            log.error("Failed to start detection for camera {}: {}", id, e.getMessage());
        }
        return cameraRepository.save(camera);
    }

    public Camera stopDetection(Long id) {
        Camera camera = findById(id);
        try {
            Map<String, Object> body = new HashMap<>();
            body.put("camera_id", camera.getId());
            restTemplate.postForEntity(aiServiceUrl + "/api/cameras/stop", body, String.class);
            camera.setStatus("INACTIVE");
            log.info("Stopped detection for camera: {}", camera.getName());
        } catch (Exception e) {
            log.error("Failed to stop detection for camera {}: {}", id, e.getMessage());
        }
        camera.setStatus("INACTIVE");
        return cameraRepository.save(camera);
    }

    public void emergencyStopAll() {
        log.warn("EMERGENCY STOP: Stopping all cameras");
        // Stop all cameras in AI service
        try {
            restTemplate.postForEntity(aiServiceUrl + "/api/cameras/stop-all", null, String.class);
        } catch (Exception e) {
            log.error("Failed to call AI stop-all: {}", e.getMessage());
        }
        // Set all active cameras to INACTIVE in DB
        List<Camera> allCameras = cameraRepository.findAll();
        for (Camera cam : allCameras) {
            if ("ACTIVE".equals(cam.getStatus())) {
                cam.setStatus("INACTIVE");
                cameraRepository.save(cam);
            }
        }
        log.warn("EMERGENCY STOP: All cameras stopped");
    }
}
