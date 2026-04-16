package app.service;
import app.model.Course;
import app.model.Enrollment;
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
import java.util.UUID;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import app.model.EnrollmentStats;

@Service
public class EnrollmentService {

    private static final String ENROLLMENTS_COLLECTION = "enrollments";
    private static final Logger logger = LoggerFactory.getLogger(EnrollmentService.class);

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private CourseService courseService;

    // ==================== ENROLL STUDENT ====================
    public Enrollment enroll(Enrollment enrollment, String token) throws Exception {

        Firestore db = FirestoreClient.getFirestore();

        // 🔥 1. Validate User via USER-SERVICE (via GATEWAY)
        String userUrl = "http://localhost:8080/api/me";
        logger.info("Validating user for enrollment via: {}", userUrl);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<User> response;
        try {
            response = restTemplate.exchange(userUrl, HttpMethod.GET, entity, User.class);
            logger.info("User validation successful, status: {}", response.getStatusCode());
        } catch (org.springframework.web.client.ResourceAccessException e) {
            logger.warn("Connection error to user service, retrying...: {}", e.getMessage());
            try {
                Thread.sleep(500);
                response = restTemplate.exchange(userUrl, HttpMethod.GET, entity, User.class);
                logger.info("Retry successful");
            } catch (Exception retryEx) {
                logger.error("Retry failed: {}", retryEx.getMessage());
                throw new RuntimeException("Failed to validate user after retries. Please login again.");
            }
        } catch (org.springframework.web.client.HttpClientErrorException.Unauthorized e) {
            logger.warn("Token unauthorized or expired");
            throw new RuntimeException("Your session has expired. Please login again.");
        } catch (Exception e) {
            logger.error("Failed to validate user: {}", e.getMessage());
            throw new RuntimeException("Failed to validate user. Please login again. Error: " + e.getMessage());
        }

        User user = response.getBody();

        if (user == null) {
            logger.warn("User validation returned null");
            throw new RuntimeException("User not found");
        }

        logger.info("User validated: {}, role: {}", user.getId(), user.getRole());

        if (!"student".equalsIgnoreCase(user.getRole())) {
            logger.warn("User {} tried to enroll but has role: {}", user.getId(), user.getRole());
            throw new RuntimeException("Only students can enroll in courses");
        }

        enrollment.setStudentId(user.getId());

        // 🔥 2. Validate Course Exists
        try {
            Course course = courseService.getCourseById(enrollment.getCourseId());
            if (course == null) {
                logger.warn("Course {} not found for enrollment", enrollment.getCourseId());
                throw new RuntimeException("Course not found");
            }
            logger.info("Course validated: {}", course.getId());
            // 🔥 2.a Check capacity
            try {
                int max = course.getMaxStudents();
                if (max > 0) {
                    long enrolledCount = db.collection(ENROLLMENTS_COLLECTION)
                            .whereEqualTo("courseId", enrollment.getCourseId())
                            .whereEqualTo("status", "enrolled")
                            .get()
                            .get()
                            .getDocuments()
                            .size();

                    if (enrolledCount >= max) {
                        logger.warn("Course {} is full ({} / {})", course.getId(), enrolledCount, max);
                        throw new RuntimeException("Enrollment failed: course is full");
                    }
                }
            } catch (RuntimeException e) {
                throw e;
            } catch (Exception ex) {
                logger.error("Failed to check course capacity: {}", ex.getMessage());
                throw new RuntimeException("Failed to validate course capacity: " + ex.getMessage());
            }
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Failed to validate course: {}", e.getMessage());
            throw new RuntimeException("Failed to validate course: " + e.getMessage());
        }

        // 🔥 3. Check Duplicate Enrollment
        try {
            boolean alreadyEnrolled = !db.collection(ENROLLMENTS_COLLECTION)
                    .whereEqualTo("studentId", enrollment.getStudentId())
                    .whereEqualTo("courseId", enrollment.getCourseId())
                    .get().get().isEmpty();

            if (alreadyEnrolled) {
                logger.warn("Student {} is already enrolled in course {}", enrollment.getStudentId(), enrollment.getCourseId());
                throw new RuntimeException("You are already enrolled in this course");
            }
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Failed to check duplicate enrollment: {}", e.getMessage());
            throw new RuntimeException("Failed to check enrollment status: " + e.getMessage());
        }

        // 🔥 4. Save Enrollment
        try {
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

            logger.info("Enrollment saved successfully: {}", enrollment.getId());
            return enrollment;
        } catch (Exception e) {
            logger.error("Failed to save enrollment: {}", e.getMessage());
            throw new RuntimeException("Failed to save enrollment: " + e.getMessage());
        }
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
                        logger.warn("Failed to fetch course {}: {}", e.getCourseId(), ex.getMessage());
                        return null;
                    }
                })
                .filter(c -> c != null)
                .toList();
    }

    // ==================== GET ENROLLMENTS BY COURSE ====================
    public List<Enrollment> getEnrollmentsByCourse(String courseId) throws Exception {
        Firestore db = FirestoreClient.getFirestore();

        List<Enrollment> enrollments = db.collection(ENROLLMENTS_COLLECTION)
                .whereEqualTo("courseId", courseId)
                .get()
                .get()
                .getDocuments()
                .stream()
                .map(doc -> doc.toObject(Enrollment.class))
                .toList();

        return enrollments;
    }

    // ==================== ADMIN ENROLL (bypass token user validation) ====================
    public Enrollment enrollAsAdmin(String studentId, String courseId) throws Exception {
        Firestore db = FirestoreClient.getFirestore();

        // Validate course
        try {
            Course course = courseService.getCourseById(courseId);
            if (course == null) {
                throw new RuntimeException("Course not found");
            }
            int max = course.getMaxStudents();
            if (max > 0) {
                long enrolledCount = db.collection(ENROLLMENTS_COLLECTION)
                        .whereEqualTo("courseId", courseId)
                        .whereEqualTo("status", "enrolled")
                        .get()
                        .get()
                        .getDocuments()
                        .size();

                if (enrolledCount >= max) {
                    throw new RuntimeException("Enrollment failed: course is full");
                }
            }
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to validate course: " + e.getMessage());
        }

        // Check duplicate
        try {
            boolean already = !db.collection(ENROLLMENTS_COLLECTION)
                    .whereEqualTo("studentId", studentId)
                    .whereEqualTo("courseId", courseId)
                    .get().get().isEmpty();

            if (already) {
                throw new RuntimeException("Student already enrolled in this course");
            }
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to check enrollment: " + e.getMessage());
        }

        // Save enrollment
        try {
            Enrollment enrollment = new Enrollment();
            enrollment.setId(UUID.randomUUID().toString());
            enrollment.setStudentId(studentId);
            enrollment.setCourseId(courseId);
            enrollment.setPaymentStatus("paid");
            enrollment.setStatus("enrolled");
            enrollment.setCreatedAt(System.currentTimeMillis());

            db.collection(ENROLLMENTS_COLLECTION)
                    .document(enrollment.getId())
                    .set(enrollment)
                    .get();

            return enrollment;
        } catch (Exception e) {
            throw new RuntimeException("Failed to save enrollment: " + e.getMessage());
        }
    }

    // ==================== BROWSE ALL ACTIVE COURSES ====================
    public List<Course> getAllActiveCourses() {
        return courseService.getAllActiveCourses();
    }

    // ==================== ENROLLMENT STATS ====================
    public EnrollmentStats getEnrollmentStats() throws Exception {
        Firestore db = FirestoreClient.getFirestore();

        long now = System.currentTimeMillis();
        long weekAgo = now - 7L * 24 * 60 * 60 * 1000;
        long monthAgo = now - 30L * 24 * 60 * 60 * 1000;

        // fetch recent month enrollments and aggregate
        List<Enrollment> recent = db.collection(ENROLLMENTS_COLLECTION)
                .whereGreaterThanOrEqualTo("createdAt", monthAgo)
                .whereEqualTo("status", "enrolled")
                .get().get().getDocuments()
                .stream().map(d -> d.toObject(Enrollment.class)).toList();

        int monthlyCount = recent.size();

        // weekly count = those with createdAt >= weekAgo
        int weeklyCount = 0;
        for (Enrollment e : recent) {
            if (e.getCreatedAt() >= weekAgo) weeklyCount++;
        }

        // daily counts for last 7 days
        Map<String, Integer> dayMap = new HashMap<>();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd").withZone(ZoneId.systemDefault());
        for (int i = 6; i >= 0; --i) {
            long dayStart = Instant.ofEpochMilli(now).minusSeconds(i * 24L * 60 * 60).toEpochMilli();
            String label = fmt.format(Instant.ofEpochMilli(dayStart));
            dayMap.put(label, 0);
        }

        for (Enrollment e : recent) {
            String d = fmt.format(Instant.ofEpochMilli(e.getCreatedAt()));
            dayMap.put(d, dayMap.getOrDefault(d, 0) + 1);
        }

        List<String> labels = new ArrayList<>();
        List<Integer> counts = new ArrayList<>();
        // ensure ordered by date ascending
        for (int i = 6; i >= 0; --i) {
            long dayStart = Instant.ofEpochMilli(now).minusSeconds(i * 24L * 60 * 60).toEpochMilli();
            String label = fmt.format(Instant.ofEpochMilli(dayStart));
            labels.add(label);
            counts.add(dayMap.getOrDefault(label, 0));
        }

        EnrollmentStats stats = new EnrollmentStats();
        stats.setMonthlyCount(monthlyCount);
        stats.setWeeklyCount(weeklyCount);
        stats.setDailyLabels(labels);
        stats.setDailyCounts(counts);
        return stats;
    }
}