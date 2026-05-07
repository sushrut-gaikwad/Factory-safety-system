package com.factory.safety.controller;

import com.factory.safety.dto.DetectionPayload;
import com.factory.safety.service.DetectionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/detections")
public class DetectionController {

    private final DetectionService detectionService;

    public DetectionController(DetectionService detectionService) {
        this.detectionService = detectionService;
    }

    @PostMapping
    public ResponseEntity<Void> receiveDetections(@RequestBody DetectionPayload payload) {
        detectionService.processDetections(payload);
        return ResponseEntity.ok().build();
    }
}
