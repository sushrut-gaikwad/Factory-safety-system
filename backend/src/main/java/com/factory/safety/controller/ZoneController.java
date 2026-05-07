package com.factory.safety.controller;

import com.factory.safety.dto.ZoneDTO;
import com.factory.safety.model.Zone;
import com.factory.safety.service.ZoneService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/zones")
public class ZoneController {

    private final ZoneService zoneService;

    public ZoneController(ZoneService zoneService) {
        this.zoneService = zoneService;
    }

    @GetMapping
    public List<Zone> getAll() {
        return zoneService.findAll();
    }

    @GetMapping("/{id}")
    public Zone getById(@PathVariable Long id) {
        return zoneService.findById(id);
    }

    @GetMapping("/camera/{cameraId}")
    public List<Zone> getByCamera(@PathVariable Long cameraId) {
        return zoneService.findByCameraId(cameraId);
    }

    @PostMapping
    public Zone create(@Valid @RequestBody ZoneDTO dto) {
        return zoneService.create(dto);
    }

    @PutMapping("/{id}")
    public Zone update(@PathVariable Long id, @Valid @RequestBody ZoneDTO dto) {
        return zoneService.update(id, dto);
    }

    @PutMapping("/{id}/toggle")
    public Zone toggleActive(@PathVariable Long id) {
        return zoneService.toggleActive(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        zoneService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
