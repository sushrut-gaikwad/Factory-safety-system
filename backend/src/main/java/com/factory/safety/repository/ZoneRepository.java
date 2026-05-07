package com.factory.safety.repository;

import com.factory.safety.model.Zone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ZoneRepository extends JpaRepository<Zone, Long> {
    List<Zone> findByCameraId(Long cameraId);
    List<Zone> findByCameraIdAndIsActive(Long cameraId, Boolean isActive);
}
