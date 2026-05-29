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
import org.springframework.web.multipart.MultipartFile;

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

    // Existing endpoint (sirf URL ke liye)
    @PostMapping
    public ResponseEntity<?> createLesson(@RequestBody Lesson lesson, HttpServletRequest request) {
        try {
            String uid = (String) request.getAttribute("uid");
            if (!courseService.isTeacher(uid, request.getHeader("Authorization"))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Only teachers or admins can create lessons"));
            }

            String lessonId = lessonService.createLesson(lesson);
            return ResponseEntity.ok(Map.of("success", true, "lessonId", lessonId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // Naya Endpoint: Video File Upload ke saath
    @PostMapping("/upload-video")
    public ResponseEntity<?> createLessonWithVideo(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("moduleId") String moduleId,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "duration", defaultValue = "0") int duration,
            HttpServletRequest request) {

        try {
            String uid = (String) request.getAttribute("uid");
            if (!courseService.isTeacher(uid, request.getHeader("Authorization"))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Only teachers or admins allowed"));
            }

            Lesson lesson = new Lesson();
            lesson.setTitle(title);
            lesson.setModuleId(moduleId);
            lesson.setDescription(description);
            lesson.setDuration(duration);
            lesson.setType("VIDEO");

            String lessonId = lessonService.createLessonWithVideo(file, lesson);

            return ResponseEntity.ok(Map.of(
                "success", true,
                "lessonId", lessonId,
                "message", "Lecture with video uploaded successfully"
            ));

        } catch (Exception e) {
            logger.error("Error uploading video lesson", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // Baaki methods (get, update, delete) same rakh sakte ho...
}