package app.controller;

import app.model.Course;
import app.service.CourseService;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class CourseController {

    @Autowired
    private CourseService courseService;

    private static final Logger logger = LoggerFactory.getLogger(CourseController.class);

    @GetMapping("/health")
    public String health() {
        return "Course Service running 🚀";
    }

    @PostMapping("/courses")
    public ResponseEntity<?> createCourse(@RequestBody Course course,
                                          HttpServletRequest request) {
        try {
            String uid = (String) request.getAttribute("uid");
            logger.info("Course creation request from UID: {}", uid);

            if (uid == null) {
                uid = "teacher123"; // temp fallback
                logger.warn("UID is null, using fallback: {}", uid);
            }

            String token = request.getHeader("Authorization");

            if (!courseService.isTeacher(uid, token)) {
                logger.warn("User {} is not authorized to create courses (requires teacher or admin)", uid);
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Only teachers or admins can create courses ❌"));
            }

            // Generate ID if not provided
            if (course.getId() == null || course.getId().isEmpty()) {
                course.setId(UUID.randomUUID().toString());
            }
            
            course.setTeacherId(uid);
            String result = courseService.createCourse(course);
            
            return ResponseEntity.ok(Map.of("success", result, "courseId", course.getId()));
        } catch (IllegalArgumentException e) {
            logger.error("Invalid course data: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid course data: " + e.getMessage()));
        } catch (Exception e) {
            logger.error("Error creating course: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create course: " + e.getMessage()));
        }
    }

    @PutMapping("/courses/{id}")
    public ResponseEntity<?> updateCourse(@PathVariable String id,
                                          @RequestBody Course course,
                                          HttpServletRequest request) {
        try {
            String uid = (String) request.getAttribute("uid");
            logger.info("Course update request for ID: {} from UID: {}", id, uid);

            if (uid == null) {
                uid = "teacher123";
                logger.warn("UID is null, using fallback: {}", uid);
            }

            String token = request.getHeader("Authorization");

            if (!courseService.isTeacher(uid, token)) {
                logger.warn("User {} is not authorized to update courses (requires teacher or admin)", uid);
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Only teachers or admins can update courses ❌"));
            }

            course.setId(id);
            course.setTeacherId(uid);
            String result = courseService.updateCourse(id, course);

            return ResponseEntity.ok(Map.of("success", result, "courseId", id));
        } catch (Exception e) {
            logger.error("Error updating course {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update course: " + e.getMessage()));
        }
    }

    @DeleteMapping("/courses/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable String id,
                                          HttpServletRequest request) {
        try {
            String uid = (String) request.getAttribute("uid");
            logger.info("Course deletion request for ID: {} from UID: {}", id, uid);

            if (uid == null) {
                uid = "teacher123";
                logger.warn("UID is null, using fallback: {}", uid);
            }

            String token = request.getHeader("Authorization");

            if (!courseService.isTeacher(uid, token)) {
                logger.warn("User {} is not authorized to delete courses (requires teacher or admin)", uid);
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Only teachers or admins can delete courses ❌"));
            }

            String result = courseService.deleteCourse(id);

            return ResponseEntity.ok(Map.of("success", result, "courseId", id));
        } catch (Exception e) {
            logger.error("Error deleting course {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to delete course: " + e.getMessage()));
        }
    }

    @GetMapping("/courses")
    public ResponseEntity<?> getCourses() {
        try {
            List<Course> courses = courseService.getAllCourses();
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            logger.error("Error fetching courses: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch courses: " + e.getMessage()));
        }
    }

    @GetMapping("/courses/{id}")
    public ResponseEntity<?> getCourseById(@PathVariable String id) {
        try {
            Course course = courseService.getCourseById(id);
            if (course == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Course not found"));
            }
            return ResponseEntity.ok(course);
        } catch (Exception e) {
            logger.error("Error fetching course {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch course: " + e.getMessage()));
        }
    }
}