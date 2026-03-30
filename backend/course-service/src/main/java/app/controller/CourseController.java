package app.controller;

import app.model.Course;
import app.service.CourseService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @GetMapping("/health")
    public String health() {
        return "Course Service running 🚀";
    }

    @PostMapping("/courses")
    public String createCourse(@RequestBody Course course,
                               HttpServletRequest request) throws Exception {

    	String uid = (String) request.getAttribute("uid");

        if (uid == null) {
            uid = "teacher123"; // temp fallback
        }

        String token = request.getHeader("Authorization");

        if (!courseService.isTeacher(uid, token)) {
            return "Only teachers can create courses ❌";
        }

        course.setTeacherId(uid);

        return courseService.createCourse(course);
    }

    @GetMapping("/courses")
    public List<Course> getCourses() throws Exception {
        return courseService.getAllCourses();
    }
    @GetMapping("/courses/{id}")
    public Course getCourseById(@PathVariable String id) throws Exception {
        return courseService.getCourseById(id);
    }
}