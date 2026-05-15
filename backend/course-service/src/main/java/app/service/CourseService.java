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

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseService {

    private static final String COLLECTION = "courses";
    private static final Logger logger = LoggerFactory.getLogger(CourseService.class);

    @Autowired
    private RestTemplate restTemplate;

    // ==================== ROLE CHECK ====================
    public boolean isTeacher(String uid, String token) {
        try {
            String url = "http://localhost:8080/api/me";
            logger.info("Checking teacher role for UID: {}", uid);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", token);
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<User> response = restTemplate.exchange(url, HttpMethod.GET, entity, User.class);

            User user = response.getBody();
            if (user == null || user.getRole() == null) {
                logger.warn("User or role is null for UID: {}", uid);
                return false;
            }

            String userRole = user.getRole();
            boolean isTeacherOrAdmin = "teacher".equalsIgnoreCase(userRole) || "admin".equalsIgnoreCase(userRole);

            logger.info("Authorization check result: {} for user: {}, role: {}", isTeacherOrAdmin, uid, userRole);
            return isTeacherOrAdmin;

        } catch (Exception e) {
            logger.error("Error checking teacher role for UID {}: {}", uid, e.getMessage());
            return false;
        }
    }

    // ==================== COURSE CRUD ====================
    public String createCourse(Course course) throws Exception {
        try {
            if (course.getId() == null || course.getId().isEmpty()) {
                throw new IllegalArgumentException("Course ID cannot be null or empty");
            }

            // Cap max students
            if (course.getMaxStudents() > 120) {
                course.setMaxStudents(120);
            }

            Firestore db = FirestoreClient.getFirestore();
            db.collection(COLLECTION).document(course.getId()).set(course).get();

            logger.info("Course created successfully: {}", course.getId());
            return "Course created successfully";
        } catch (Exception e) {
            logger.error("Error creating course: {}", e.getMessage(), e);
            throw new Exception("Failed to create course", e);
        }
    }

    public String updateCourse(String courseId, Course course) throws Exception {
        try {
            if (course.getMaxStudents() > 120) {
                course.setMaxStudents(120);
            }
            course.setUpdatedAt(System.currentTimeMillis());

            Firestore db = FirestoreClient.getFirestore();
            db.collection(COLLECTION).document(courseId).set(course).get();

            logger.info("Course updated successfully: {}", courseId);
            return "Course updated successfully";
        } catch (Exception e) {
            logger.error("Error updating course {}: {}", courseId, e.getMessage(), e);
            throw new Exception("Failed to update course", e);
        }
    }

    public String deleteCourse(String courseId) throws Exception {
        try {
            Firestore db = FirestoreClient.getFirestore();
            db.collection(COLLECTION).document(courseId).delete().get();

            logger.info("Course deleted successfully: {}", courseId);
            return "Course deleted successfully";
        } catch (Exception e) {
            logger.error("Error deleting course {}: {}", courseId, e.getMessage(), e);
            throw new Exception("Failed to delete course", e);
        }
    }

    public List<Course> getAllCourses() throws Exception {
        try {
            Firestore db = FirestoreClient.getFirestore();
            return db.collection(COLLECTION)
                    .get()
                    .get()
                    .getDocuments()
                    .stream()
                    .map(doc -> doc.toObject(Course.class))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error fetching all courses: {}", e.getMessage(), e);
            throw e;
        }
    }

    public Course getCourseById(String id) throws Exception {
        try {
            Firestore db = FirestoreClient.getFirestore();
            return db.collection(COLLECTION)
                    .document(id)
                    .get()
                    .get()
                    .toObject(Course.class);
        } catch (Exception e) {
            logger.error("Error fetching course by ID {}: {}", id, e.getMessage(), e);
            throw e;
        }
    }
}