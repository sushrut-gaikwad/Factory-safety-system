package com.factory.safety.service;

import com.factory.safety.dto.ZoneDTO;
import com.factory.safety.exception.ResourceNotFoundException;
import com.factory.safety.model.Zone;
import com.factory.safety.repository.ZoneRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ZoneService {

    private final ZoneRepository zoneRepository;

    public ZoneService(ZoneRepository zoneRepository) {
        this.zoneRepository = zoneRepository;
    }

    public List<Zone> findAll() {
        return zoneRepository.findAll();
    }

    public Zone findById(Long id) {
        return zoneRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Zone not found: " + id));
    }

    public List<Zone> findByCameraId(Long cameraId) {
        return zoneRepository.findByCameraId(cameraId);
    }

    public List<Zone> findActiveByCamera(Long cameraId) {
        return zoneRepository.findByCameraIdAndIsActive(cameraId, true);
    }

    public Zone create(ZoneDTO dto) {
        Zone zone = new Zone();
        zone.setName(dto.getName());
        zone.setCameraId(dto.getCameraId());
        zone.setZoneType(dto.getZoneType());
        zone.setCoordinates(dto.getCoordinates());
        zone.setSeverity(dto.getSeverity());
        return zoneRepository.save(zone);
    }

    public Zone update(Long id, ZoneDTO dto) {
        Zone zone = findById(id);
        zone.setName(dto.getName());
        zone.setCameraId(dto.getCameraId());
        zone.setZoneType(dto.getZoneType());
        zone.setCoordinates(dto.getCoordinates());
        zone.setSeverity(dto.getSeverity());
        return zoneRepository.save(zone);
    }

    public Zone toggleActive(Long id) {
        Zone zone = findById(id);
        zone.setIsActive(!zone.getIsActive());
        return zoneRepository.save(zone);
    }

    public void delete(Long id) {
        Zone zone = findById(id);
        zoneRepository.delete(zone);
    }
}
