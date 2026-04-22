package app.controller;

import app.model.Lesson;
import app.service.LessonService;
import app.service.CourseService;
import jakarta.servlet.http.HttpServletRequest;
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

    @PostMapping
    public ResponseEntity<?> createLesson(@RequestBody Lesson lesson, HttpServletRequest request) {
        String uid = (String) request.getAttribute("uid");
        String token = request.getHeader("Authorization");

        // Security: Check if user is a teacher
        if (!courseService.isTeacher(uid, token)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Unauthorized"));
        }

        String lessonId = lessonService.createLesson(lesson);
        return ResponseEntity.ok(Map.of("id", lessonId));
    }

    @GetMapping("/module/{moduleId}")
    public ResponseEntity<List<Lesson>> getLessonsByModule(@PathVariable String moduleId) {
        return ResponseEntity.ok(lessonService.getLessonsByModule(moduleId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLesson(@PathVariable String id) {
        lessonService.deleteLesson(id);
        return ResponseEntity.ok(Map.of("success", true));
    }
}