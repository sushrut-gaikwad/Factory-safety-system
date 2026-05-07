package com.factory.safety.controller;

import com.factory.safety.dto.AlertMessage;
import com.factory.safety.service.AlertService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping("/active")
    public List<AlertMessage> getActiveAlerts() {
        return alertService.getActiveAlerts();
    }

    @GetMapping("/status")
    public Map<String, String> getStatus() {
        return Map.of("status", alertService.getSystemStatus());
    }

    @PostMapping("/clear")
    public ResponseEntity<Void> clearAlerts() {
        alertService.clearAlerts();
        return ResponseEntity.ok().build();
    }
}
