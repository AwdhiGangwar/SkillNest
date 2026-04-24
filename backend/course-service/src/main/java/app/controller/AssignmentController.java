package app.controller;

import app.model.Assignment;
import app.service.AssignmentService;
import app.service.CourseService;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    @Autowired
    private AssignmentService assignmentService;

    @Autowired
    private CourseService courseService;

    private static final Logger logger = LoggerFactory.getLogger(AssignmentController.class);

    @PostMapping
public ResponseEntity<?> createAssignment(@RequestBody Assignment assignment, HttpServletRequest request) {
    try {
        String uid = (String) request.getAttribute("uid");
        String token = request.getHeader("Authorization");
        String role = (String) request.getAttribute("role"); // ✅ add karo

        logger.info("Assignment creation request from UID: {}, role: {}", uid, role);

        // ✅ Admin bypass
        boolean isAuthorized = "admin".equalsIgnoreCase(role) || 
                               "teacher".equalsIgnoreCase(role) ||
                               courseService.isTeacher(uid, token);

        if (!isAuthorized) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Only teachers or admins can create assignments"));
        }

        String assignmentId = assignmentService.createAssignment(assignment);
        return ResponseEntity.ok(Map.of("success", true, "assignmentId", assignmentId));
    } catch (Exception e) {
        logger.error("Error creating assignment: {}", e.getMessage(), e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to create assignment: " + e.getMessage()));
    }
}

    @GetMapping("/{assignmentId}")
    public ResponseEntity<?> getAssignment(@PathVariable String assignmentId) {
        try {
            Assignment assignment = assignmentService.getAssignment(assignmentId);
            if (assignment == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(assignment);
        } catch (Exception e) {
            logger.error("Error getting assignment: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to get assignment: " + e.getMessage()));
        }
    }
@GetMapping("/lesson/{lessonId}")
public ResponseEntity<?> getAssignmentsByLesson(@PathVariable String lessonId) {
    try {
        List<Assignment> assignments = assignmentService.getAssignmentsByLesson(lessonId);
        return ResponseEntity.ok(assignments);
    } catch (Exception e) {
        logger.error("Error getting assignments for lesson: {}", e.getMessage(), e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to get assignments: " + e.getMessage()));
    }
}

// ✅ Naya endpoint add karo
@GetMapping("/course/{courseId}")
public ResponseEntity<?> getAssignmentsByCourse(@PathVariable String courseId) {
    try {
        List<Assignment> assignments = assignmentService.getAssignmentsByCourse(courseId);
        return ResponseEntity.ok(assignments);
    } catch (Exception e) {
        logger.error("Error getting assignments for course: {}", e.getMessage(), e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to get assignments: " + e.getMessage()));
    }
}

    @PutMapping("/{assignmentId}")
    public ResponseEntity<?> updateAssignment(@PathVariable String assignmentId, @RequestBody Assignment assignment, HttpServletRequest request) {
        try {
            String uid = (String) request.getAttribute("uid");
            String token = request.getHeader("Authorization");

            logger.info("Assignment update request from UID: {}", uid);

            if (!courseService.isTeacher(uid, token)) {
                logger.warn("User {} is not authorized to update assignments", uid);
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Only teachers or admins can update assignments"));
            }

            assignment.setId(assignmentId);
            assignmentService.updateAssignment(assignmentId, assignment);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            logger.error("Error updating assignment: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update assignment: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{assignmentId}")
    public ResponseEntity<?> deleteAssignment(@PathVariable String assignmentId, HttpServletRequest request) {
        try {
            String uid = (String) request.getAttribute("uid");
            String token = request.getHeader("Authorization");

            logger.info("Assignment deletion request from UID: {}", uid);

            if (!courseService.isTeacher(uid, token)) {
                logger.warn("User {} is not authorized to delete assignments", uid);
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Only teachers or admins can delete assignments"));
            }

            assignmentService.deleteAssignment(assignmentId);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            logger.error("Error deleting assignment: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to delete assignment: " + e.getMessage()));
        }
    }
}
