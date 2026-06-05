package app.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/actuator")
@Slf4j
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        log.debug("Health check endpoint called");
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "API-GATEWAY");
        response.put("timestamp", LocalDateTime.now());
        response.put("uptime", Runtime.getRuntime().totalMemory());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health/ready")
    public ResponseEntity<Map<String, Object>> readiness() {
        log.debug("Readiness check endpoint called");
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", "READY");
        response.put("service", "API-GATEWAY");
        response.put("timestamp", LocalDateTime.now());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health/live")
    public ResponseEntity<Map<String, Object>> liveness() {
        log.debug("Liveness check endpoint called");
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", "ALIVE");
        response.put("service", "API-GATEWAY");
        response.put("timestamp", LocalDateTime.now());
        
        return ResponseEntity.ok(response);
    }
}
