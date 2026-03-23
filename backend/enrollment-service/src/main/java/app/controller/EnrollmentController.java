package app.controller;

import app.model.Enrollment;
import app.model.Course;
import app.service.EnrollmentService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    // ✅ Health check
    @GetMapping("/health")
    public String health() {
        return "Enrollment Service running 🚀";
    }

    // ✅ Enroll in course (with role check)
    @PostMapping("/enrollments")
    public String enroll(@RequestBody Enrollment enrollment,
                         HttpServletRequest request) throws Exception {

        String uid = (String) request.getAttribute("uid");

        if (uid == null) {
            uid = "student123"; // temp fallback
        }

        String token = request.getHeader("Authorization");

        enrollment.setStudentId(uid);

        return enrollmentService.enroll(enrollment, token);
    }

    // ✅ Student dashboard (My Courses)
    @GetMapping("/my-courses")
    public List<Course> getMyCourses(HttpServletRequest request) throws Exception {

        String uid = (String) request.getAttribute("uid");

        if (uid == null) {
            uid = "student123";
        }

        return enrollmentService.getMyCourses(uid);
    }
}