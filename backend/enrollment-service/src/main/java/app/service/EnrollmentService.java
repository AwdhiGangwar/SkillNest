package app.service;

import app.model.Course;
import app.model.Enrollment;
import app.model.User;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.UUID;

@Service
public class EnrollmentService {

    private static final String ENROLLMENTS_COLLECTION = "enrollments";

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private CourseService courseService;

    // ==================== ENROLL STUDENT ====================
    public Enrollment enroll(Enrollment enrollment, String token) throws Exception {

        Firestore db = FirestoreClient.getFirestore();

        // 🔥 1. Validate User via USER-SERVICE (via GATEWAY)
        String userUrl = "http://localhost:8080/api/me";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", token);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<User> response;
        try {
            response = restTemplate.exchange(userUrl, HttpMethod.GET, entity, User.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to validate user. Please login again.");
        }

        User user = response.getBody();

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        if (!"student".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("Only students can enroll in courses");
        }

        enrollment.setStudentId(user.getId());

        // 🔥 2. Validate Course Exists
        Course course = courseService.getCourseById(enrollment.getCourseId());
        if (course == null) {
            throw new RuntimeException("Course not found");
        }

        // 🔥 3. Check Duplicate Enrollment
        boolean alreadyEnrolled = !db.collection(ENROLLMENTS_COLLECTION)
                .whereEqualTo("studentId", enrollment.getStudentId())
                .whereEqualTo("courseId", enrollment.getCourseId())
                .get().get().isEmpty();

        if (alreadyEnrolled) {
            throw new RuntimeException("You are already enrolled in this course");
        }

        // 🔥 4. Save Enrollment
        if (enrollment.getId() == null || enrollment.getId().isEmpty()) {
            enrollment.setId(UUID.randomUUID().toString());
        }

        enrollment.setPaymentStatus("paid");
        enrollment.setStatus("enrolled");
        enrollment.setCreatedAt(System.currentTimeMillis());

        db.collection(ENROLLMENTS_COLLECTION)
                .document(enrollment.getId())
                .set(enrollment)
                .get();

        return enrollment;
    }

    // ==================== GET MY ENROLLED COURSES ====================
    public List<Course> getMyCourses(String studentId) throws Exception {

        Firestore db = FirestoreClient.getFirestore();

        List<Enrollment> enrollments = db.collection(ENROLLMENTS_COLLECTION)
                .whereEqualTo("studentId", studentId)
                .whereEqualTo("status", "enrolled")
                .get().get().getDocuments()
                .stream()
                .map(doc -> doc.toObject(Enrollment.class))
                .toList();

        // 🔥 Fetch course details safely
        return enrollments.stream()
                .map(e -> {
                    try {
                        return courseService.getCourseById(e.getCourseId());
                    } catch (Exception ex) {
                        return null;
                    }
                })
                .filter(c -> c != null)
                .toList();
    }

    // ==================== BROWSE ALL ACTIVE COURSES ====================
    public List<Course> getAllActiveCourses() {
        return courseService.getAllActiveCourses();
    }
}