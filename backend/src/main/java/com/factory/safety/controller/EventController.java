package com.factory.safety.controller;

import com.factory.safety.model.Event;
import com.factory.safety.service.EventService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public Page<Event> getEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) Long cameraId,
            @RequestParam(required = false) String eventType) {
        if (cameraId != null) {
            return eventService.getEventsByCamera(cameraId, page, size);
        }
        if (eventType != null) {
            return eventService.getEventsByType(eventType, page, size);
        }
        return eventService.getEvents(page, size);
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        return Map.of(
                "last24h", eventService.countRecentEvents(24),
                "lastHour", eventService.countRecentEvents(1)
        );
    }
}
