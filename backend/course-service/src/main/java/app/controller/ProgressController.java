package app.controller;

import app.model.Progress;
import app.service.ProgressService;
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
@RequestMapping("/api/progress")
public class ProgressController {

    @Autowired
    private ProgressService progressService;

    private static final Logger logger = LoggerFactory.getLogger(ProgressController.class);

    @PostMapping
    public ResponseEntity<?> createProgress(@RequestBody Progress progress) {
        try {
            logger.info("Progress creation for student: {}, lesson: {}", progress.getStudentId(), progress.getLessonId());

            String progressId = progressService.createProgress(progress);
            return ResponseEntity.ok(Map.of("success", true, "progressId", progressId));
        } catch (Exception e) {
            logger.error("Error creating progress: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create progress: " + e.getMessage()));
        }
    }

    @GetMapping("/{progressId}")
    public ResponseEntity<?> getProgress(@PathVariable String progressId) {
        try {
            Progress progress = progressService.getProgress(progressId);
            if (progress == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(progress);
        } catch (Exception e) {
            logger.error("Error getting progress: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to get progress: " + e.getMessage()));
        }
    }

    @GetMapping("/lesson/{studentId}/{lessonId}")
    public ResponseEntity<?> getProgressByLesson(@PathVariable String studentId, @PathVariable String lessonId) {
        try {
            Progress progress = progressService.getProgressByLessonAndStudent(studentId, lessonId);
            if (progress == null) {
                return ResponseEntity.ok(Map.of("completed", false));
            }
            return ResponseEntity.ok(progress);
        } catch (Exception e) {
            logger.error("Error getting progress: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to get progress: " + e.getMessage()));
        }
    }

    @GetMapping("/course/{studentId}/{courseId}")
    public ResponseEntity<?> getCourseProgress(@PathVariable String studentId, @PathVariable String courseId,
                                              @RequestParam(defaultValue = "0") int totalLessons) {
        try {
            List<Progress> progressList = progressService.getProgressByCourse(studentId, courseId);
            long completedCount = progressList.stream().filter(Progress::isCompleted).count();
            
            double percentage = totalLessons > 0 ? (completedCount * 100.0) / totalLessons : 0;
            percentage = Math.round(percentage * 100.0) / 100.0;
            
            return ResponseEntity.ok(Map.of(
                    "studentId", studentId,
                    "courseId", courseId,
                    "totalLessons", totalLessons,
                    "completedLessons", completedCount,
                    "progressPercentage", percentage
            ));
        } catch (Exception e) {
            logger.error("Error getting course progress: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to get progress: " + e.getMessage()));
        }
    }

    @PostMapping("/{studentId}/{courseId}/{lessonId}/mark-complete")
    public ResponseEntity<?> markLessonComplete(@PathVariable String studentId,
                                               @PathVariable String courseId,
                                               @PathVariable String lessonId) {
        try {
            logger.info("Marking lesson complete - student: {}, lesson: {}", studentId, lessonId);
            progressService.markLessonComplete(studentId, courseId, lessonId);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            logger.error("Error marking lesson complete: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to mark lesson complete: " + e.getMessage()));
        }
    }

    @PutMapping("/{progressId}")
    public ResponseEntity<?> updateProgress(@PathVariable String progressId, @RequestBody Progress progress) {
        try {
            logger.info("Progress update for: {}", progressId);
            progressService.updateProgress(progressId, progress);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            logger.error("Error updating progress: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update progress: " + e.getMessage()));
        }
    }
}
