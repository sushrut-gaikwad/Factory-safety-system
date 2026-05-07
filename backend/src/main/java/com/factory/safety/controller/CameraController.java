package com.factory.safety.controller;

import com.factory.safety.dto.CameraDTO;
import com.factory.safety.model.Camera;
import com.factory.safety.service.CameraService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cameras")
public class CameraController {

    private final CameraService cameraService;

    public CameraController(CameraService cameraService) {
        this.cameraService = cameraService;
    }

    @GetMapping
    public List<Camera> getAll() {
        return cameraService.findAll();
    }

    @GetMapping("/{id}")
    public Camera getById(@PathVariable Long id) {
        return cameraService.findById(id);
    }

    @PostMapping
    public Camera create(@Valid @RequestBody CameraDTO dto) {
        return cameraService.create(dto);
    }

    @PutMapping("/{id}")
    public Camera update(@PathVariable Long id, @Valid @RequestBody CameraDTO dto) {
        return cameraService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        cameraService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/start")
    public Camera startDetection(@PathVariable Long id) {
        return cameraService.startDetection(id);
    }

    @PostMapping("/{id}/stop")
    public Camera stopDetection(@PathVariable Long id) {
        return cameraService.stopDetection(id);
    }

    @PostMapping("/emergency-stop")
    public Map<String, String> emergencyStop() {
        cameraService.emergencyStopAll();
        return Map.of("status", "all_stopped", "message", "Emergency stop activated");
    }
}
