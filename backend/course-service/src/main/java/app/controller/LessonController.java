package app.controller;

import app.model.Lesson;
import app.service.LessonService;
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
@RequestMapping("/api/lessons")
public class LessonController {

    @Autowired
    private LessonService lessonService;

    @Autowired
    private CourseService courseService;

    private static final Logger logger = LoggerFactory.getLogger(LessonController.class);

    @PostMapping
    public ResponseEntity<?> createLesson(@RequestBody Lesson lesson, HttpServletRequest request) {
        try {
            String uid = (String) request.getAttribute("uid");
            String token = request.getHeader("Authorization");

            logger.info("Lesson creation request from UID: {}", uid);

            if (!courseService.isTeacher(uid, token)) {
                logger.warn("User {} is not authorized to create lessons", uid);
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Only teachers or admins can create lessons"));
            }

            String lessonId = lessonService.createLesson(lesson);
            return ResponseEntity.ok(Map.of("success", true, "lessonId", lessonId));
        } catch (Exception e) {
            logger.error("Error creating lesson: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create lesson: " + e.getMessage()));
        }
    }

    @GetMapping("/{lessonId}")
    public ResponseEntity<?> getLesson(@PathVariable String lessonId) {
        try {
            Lesson lesson = lessonService.getLesson(lessonId);
            if (lesson == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(lesson);
        } catch (Exception e) {
            logger.error("Error getting lesson: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to get lesson: " + e.getMessage()));
        }
    }

    @GetMapping("/module/{moduleId}")
    public ResponseEntity<?> getLessonsByModule(@PathVariable String moduleId) {
        try {
            List<Lesson> lessons = lessonService.getLessonsByModule(moduleId);
            return ResponseEntity.ok(lessons);
        } catch (Exception e) {
            logger.error("Error getting lessons for module: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to get lessons: " + e.getMessage()));
        }
    }

    @PutMapping("/{lessonId}")
    public ResponseEntity<?> updateLesson(@PathVariable String lessonId, @RequestBody Lesson lesson, HttpServletRequest request) {
        try {
            String uid = (String) request.getAttribute("uid");
            String token = request.getHeader("Authorization");

            logger.info("Lesson update request from UID: {}", uid);

            if (!courseService.isTeacher(uid, token)) {
                logger.warn("User {} is not authorized to update lessons", uid);
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Only teachers or admins can update lessons"));
            }

            lesson.setId(lessonId);
            lessonService.updateLesson(lessonId, lesson);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            logger.error("Error updating lesson: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update lesson: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{lessonId}")
    public ResponseEntity<?> deleteLesson(@PathVariable String lessonId, HttpServletRequest request) {
        try {
            String uid = (String) request.getAttribute("uid");
            String token = request.getHeader("Authorization");

            logger.info("Lesson deletion request from UID: {}", uid);

            if (!courseService.isTeacher(uid, token)) {
                logger.warn("User {} is not authorized to delete lessons", uid);
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Only teachers or admins can delete lessons"));
            }

            lessonService.deleteLesson(lessonId);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            logger.error("Error deleting lesson: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to delete lesson: " + e.getMessage()));
        }
    }

    @PostMapping("/{lessonId}/reorder")
    public ResponseEntity<?> reorderLessons(@PathVariable String lessonId, @RequestBody Map<String, List<String>> request, HttpServletRequest httpRequest) {
        try {
            String uid = (String) httpRequest.getAttribute("uid");
            String token = httpRequest.getHeader("Authorization");

            logger.info("Lesson reorder request from UID: {}", uid);

            if (!courseService.isTeacher(uid, token)) {
                logger.warn("User {} is not authorized to reorder lessons", uid);
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Only teachers or admins can reorder lessons"));
            }

            List<String> lessonIds = request.get("lessonIds");
            Lesson lesson = lessonService.getLesson(lessonId);
            lessonService.reorderLessons(lesson.getModuleId(), lessonIds);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            logger.error("Error reordering lessons: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to reorder lessons: " + e.getMessage()));
        }
    }
}
