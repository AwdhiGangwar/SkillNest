package app.controller;

import app.model.Availability;
import app.service.AvailabilityService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class AvailabilityController {

    @Autowired
    private AvailabilityService availabilityService;

    // 🔥 GET availability
    @GetMapping("/availability/{teacherId}")
    public ResponseEntity<?> getAvailability(@PathVariable String teacherId) {
        try {
            List<Availability> slots = availabilityService.getTeacherAvailability(teacherId);
            return ResponseEntity.ok(slots);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching availability");
        }
    }

    // 🔥 ADD slot
    @PostMapping("/availability")
    public ResponseEntity<?> addSlot(@RequestBody Availability slot,
                                     HttpServletRequest request) {
        try {
            String uid = (String) request.getAttribute("uid");

            if (uid == null) {
                return ResponseEntity.status(401).body("Unauthorized");
            }

            slot.setTeacherId(uid);

            return ResponseEntity.ok(availabilityService.addSlot(slot));

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error adding slot");
        }
    }
}