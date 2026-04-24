package app.controller;
import app.model.ClassEntity;
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
    // ✅ Yeh add karo ClassController.java mein
@GetMapping("/classes/course/{courseId}")
public ResponseEntity<?> getClassesByCourse(@PathVariable String courseId) {
    try {
        return ResponseEntity.ok(classService.getClassesByCourse(courseId));
    } catch (Exception e) {
        return ResponseEntity.status(500).body("Error fetching classes");
    }
}

// ✅ Create class endpoint bhi add karo
@PostMapping("/classes")
public ResponseEntity<?> createClass(@RequestBody ClassEntity classEntity,
                                      HttpServletRequest request) {
    try {
        String uid = (String) request.getAttribute("uid");
        if (uid == null) return ResponseEntity.status(401).body("Unauthorized");
        
        ClassEntity created = classService.createClass(classEntity);
        return ResponseEntity.ok(created);
    } catch (Exception e) {
        return ResponseEntity.status(500).body("Error: " + e.getMessage());
    }
}

// ✅ Delete class endpoint
@DeleteMapping("/classes/{id}")
public ResponseEntity<?> deleteClass(@PathVariable String id) {
    try {
        classService.deleteClass(id);
        return ResponseEntity.ok("Class deleted");
    } catch (Exception e) {
        return ResponseEntity.status(500).body("Error deleting class");
    }
}

@PutMapping("/classes/{id}/reschedule")
public ResponseEntity<?> rescheduleClass(@PathVariable String id, 
                                          @RequestBody ClassEntity updatedClass) {
    try {
        classService.rescheduleClass(id, updatedClass);
        return ResponseEntity.ok("Class rescheduled successfully");
    } catch (Exception e) {
        return ResponseEntity.status(500).body("Error: " + e.getMessage());
    }
}
}