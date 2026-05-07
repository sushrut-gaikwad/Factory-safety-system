package com.factory.safety.service;

import com.factory.safety.model.Event;
import com.factory.safety.repository.EventRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public Event logEvent(Long cameraId, Long zoneId, String eventType,
                          int personCount, String details, String severity) {
        Event event = new Event();
        event.setCameraId(cameraId);
        event.setZoneId(zoneId);
        event.setEventType(eventType);
        event.setPersonCount(personCount);
        event.setDetails(details);
        event.setSeverity(severity);
        return eventRepository.save(event);
    }

    public Page<Event> getEvents(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return eventRepository.findAllByOrderByTimestampDesc(pageable);
    }

    public Page<Event> getEventsByCamera(Long cameraId, int page, int size) {
        return eventRepository.findByCameraIdOrderByTimestampDesc(cameraId, PageRequest.of(page, size));
    }

    public Page<Event> getEventsByType(String eventType, int page, int size) {
        return eventRepository.findByEventTypeOrderByTimestampDesc(eventType, PageRequest.of(page, size));
    }

    public long countRecentEvents(int hours) {
        return eventRepository.countByTimestampAfter(LocalDateTime.now().minusHours(hours));
    }
}
