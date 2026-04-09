package app.service;

import app.model.Course;
import app.model.User;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseService {

    private static final String COLLECTION = "courses";
    private static final Logger logger = LoggerFactory.getLogger(CourseService.class);

    @Autowired
    private RestTemplate restTemplate;

    public boolean isTeacher(String uid, String token) {
        try {
            String url = "http://localhost:8080/api/me";
            logger.info("Checking teacher role for UID: {}", uid);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", token);
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<User> response;
            try {
                response = restTemplate.exchange(url, HttpMethod.GET, entity, User.class);
                logger.info("User service responded with status: {}", response.getStatusCode());
            } catch (org.springframework.web.client.ResourceAccessException e) {
                logger.error("Connection error to user service ({}), retrying...: {}", url, e.getMessage());
                // Retry once after brief delay
                try {
                    Thread.sleep(500);
                    response = restTemplate.exchange(url, HttpMethod.GET, entity, User.class);
                    logger.info("Retry successful, user service responded");
                } catch (Exception retryException) {
                    logger.error("Retry failed: {}", retryException.getMessage());
                    return false;
                }
            }

            User user = response.getBody();
            if (user == null) {
                logger.warn("User object is null for UID: {}", uid);
                return false;
            }
            
            String userRole = user.getRole();
            boolean isTeacherOrAdmin = "teacher".equalsIgnoreCase(userRole) || "admin".equalsIgnoreCase(userRole);

            logger.info("Authorization check (teacher|admin) result: {} for user: {}, role: {}", isTeacherOrAdmin, uid, userRole);
            return isTeacherOrAdmin;

        } catch (org.springframework.web.client.HttpClientErrorException.Unauthorized e) {
            logger.warn("Unauthorized: Token may be expired for UID: {}", uid);
            return false;
        } catch (org.springframework.web.client.HttpClientErrorException e) {
            logger.error("HTTP error while checking teacher role for UID {}: {} - {}", uid, e.getStatusCode(), e.getMessage());
            return false;
        } catch (Exception e) {
            logger.error("Unexpected error while checking teacher role for UID {}: {}", uid, e.getMessage(), e);
            return false;
        }
    }

    public String createCourse(Course course) throws Exception {
        try {
            if (course.getId() == null || course.getId().isEmpty()) {
                logger.warn("Course ID is null or empty");
                throw new IllegalArgumentException("Course ID cannot be null or empty");
            }
            
            logger.info("Creating course with ID: {}, title: {}", course.getId(), course.getTitle());
            Firestore db = FirestoreClient.getFirestore();

            db.collection(COLLECTION)
                    .document(course.getId())
                    .set(course)
                    .get();
            
            logger.info("Course created successfully: {}", course.getId());
            return "Course created successfully";
        } catch (Exception e) {
            logger.error("Error creating course: {}", e.getMessage(), e);
            throw new Exception("Failed to create course: " + e.getMessage(), e);
        }
    }

    public String updateCourse(String courseId, Course course) throws Exception {
        try {
            logger.info("Updating course with ID: {}", courseId);
            Firestore db = FirestoreClient.getFirestore();

            course.setUpdatedAt(System.currentTimeMillis());
            db.collection(COLLECTION)
                    .document(courseId)
                    .set(course)
                    .get();

            logger.info("Course updated successfully: {}", courseId);
            return "Course updated successfully";
        } catch (Exception e) {
            logger.error("Error updating course {}: {}", courseId, e.getMessage(), e);
            throw new Exception("Failed to update course: " + e.getMessage(), e);
        }
    }

    public String deleteCourse(String courseId) throws Exception {
        try {
            logger.info("Deleting course with ID: {}", courseId);
            Firestore db = FirestoreClient.getFirestore();

            db.collection(COLLECTION)
                    .document(courseId)
                    .delete()
                    .get();

            logger.info("Course deleted successfully: {}", courseId);
            return "Course deleted successfully";
        } catch (Exception e) {
            logger.error("Error deleting course {}: {}", courseId, e.getMessage(), e);
            throw new Exception("Failed to delete course: " + e.getMessage(), e);
        }
    }

    public List<Course> getAllCourses() throws Exception {
        try {
            logger.info("Fetching all courses");
            Firestore db = FirestoreClient.getFirestore();

            return db.collection(COLLECTION)
                    .get()
                    .get()
                    .getDocuments()
                    .stream()
                    .map(doc -> doc.toObject(Course.class))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error fetching courses: {}", e.getMessage(), e);
            throw e;
        }
    }

    public Course getCourseById(String id) throws Exception {
        try {
            logger.info("Fetching course by ID: {}", id);
            Firestore db = FirestoreClient.getFirestore();

            return db.collection(COLLECTION)
                    .document(id)
                    .get()
                    .get()
                    .toObject(Course.class);
        } catch (Exception e) {
            logger.error("Error fetching course {}: {}", id, e.getMessage(), e);
            throw e;
        }
    }
}