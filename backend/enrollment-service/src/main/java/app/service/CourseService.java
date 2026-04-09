package app.service;

import app.model.Course;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class CourseService {

    private static final String COURSE_SERVICE_URL = "http://localhost:8082/api/courses";
    private static final Logger logger = LoggerFactory.getLogger(CourseService.class);

    @Autowired
    private RestTemplate restTemplate;

    public List<Course> getAllActiveCourses() {
        try {
            logger.info("Fetching all active courses from: {}", COURSE_SERVICE_URL);
            ResponseEntity<Course[]> response = restTemplate.getForEntity(
                    COURSE_SERVICE_URL, Course[].class);
            
            if (response.getBody() == null) {
                logger.warn("Course service returned null body");
                return new ArrayList<>();
            }
            
            logger.info("Successfully fetched {} courses", response.getBody().length);
            return Arrays.asList(response.getBody());
        } catch (org.springframework.web.client.ResourceAccessException e) {
            logger.error("Connection error fetching courses (will retry): {}", e.getMessage());
            // Retry once
            try {
                Thread.sleep(500);
                ResponseEntity<Course[]> retryResponse = restTemplate.getForEntity(
                        COURSE_SERVICE_URL, Course[].class);
                return Arrays.asList(retryResponse.getBody() != null ? retryResponse.getBody() : new Course[]{});
            } catch (Exception retryEx) {
                logger.error("Retry failed: {}", retryEx.getMessage());
                return new ArrayList<>();
            }
        } catch (Exception e) {
            logger.error("Failed to fetch courses: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    public Course getCourseById(String courseId) {
        try {
            logger.info("Fetching course: {}", courseId);
            Course course = restTemplate.getForObject(COURSE_SERVICE_URL + "/" + courseId, Course.class);
            
            if (course == null) {
                logger.warn("Course not found: {}", courseId);
                return null;
            }
            
            logger.info("Course found: {}", courseId);
            return course;
        } catch (org.springframework.web.client.ResourceAccessException e) {
            logger.warn("Connection error fetching course {}, retrying: {}", courseId, e.getMessage());
            try {
                Thread.sleep(500);
                return restTemplate.getForObject(COURSE_SERVICE_URL + "/" + courseId, Course.class);
            } catch (Exception retryEx) {
                logger.error("Retry failed for course {}: {}", courseId, retryEx.getMessage());
                return null;
            }
        } catch (org.springframework.web.client.HttpClientErrorException.NotFound e) {
            logger.warn("Course not found: {}", courseId);
            return null;
        } catch (Exception e) {
            logger.error("Failed to fetch course {}: {}", courseId, e.getMessage());
            return null;
        }
    }
}