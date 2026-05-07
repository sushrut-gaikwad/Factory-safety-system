package com.factory.safety.repository;

import com.factory.safety.model.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    Page<Event> findAllByOrderByTimestampDesc(Pageable pageable);
    Page<Event> findByCameraIdOrderByTimestampDesc(Long cameraId, Pageable pageable);
    Page<Event> findByEventTypeOrderByTimestampDesc(String eventType, Pageable pageable);
    long countByTimestampAfter(LocalDateTime after);
}
