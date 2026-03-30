package app.service;

import app.model.Course;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

@Service
public class CourseService {

    private static final String COURSE_SERVICE_URL = "http://localhost:8082/api/courses";

    @Autowired
    private RestTemplate restTemplate;

    public List<Course> getAllActiveCourses() {
        try {
            ResponseEntity<Course[]> response = restTemplate.getForEntity(
                    COURSE_SERVICE_URL + "/active", Course[].class);
            return Arrays.asList(response.getBody());
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch courses: " + e.getMessage());
        }
    }

    public Course getCourseById(String courseId) {
        try {
            return restTemplate.getForObject(COURSE_SERVICE_URL + "/" + courseId, Course.class);
        } catch (Exception e) {
            throw new RuntimeException("Course not found: " + courseId);
        }
    }
}