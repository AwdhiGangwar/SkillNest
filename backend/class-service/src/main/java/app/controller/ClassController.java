package app.controller;

import app.service.ClassService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ClassController {

    @Autowired
    private ClassService classService;

    @GetMapping("/health")
    public String health() {
        return "Class Service running 🚀";
    }

    // 🔥 STUDENT CLASSES
    @GetMapping("/classes/student")
    public ResponseEntity<?> getStudentClasses(HttpServletRequest request) {
        try {
            String uid = (String) request.getAttribute("uid");

            if (uid == null) {
                return ResponseEntity.status(401).body("Unauthorized");
            }

            return ResponseEntity.ok(classService.getStudentClasses(uid));

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching classes");
        }
    }

    // 🔥 TEACHER CLASSES
    @GetMapping("/classes/teacher")
    public ResponseEntity<?> getTeacherClasses(HttpServletRequest request) {
        try {
            String uid = (String) request.getAttribute("uid");

            if (uid == null) {
                return ResponseEntity.status(401).body("Unauthorized");
            }

            return ResponseEntity.ok(classService.getTeacherClasses(uid));

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching classes");
        }
    }
}