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

        // 🔥 Fetch course details directly from Firebase (avoid API call 401 issues)
        return enrollments.stream()
                .map(e -> {
                    try {
                        var courseDoc = db.collection("courses").document(e.getCourseId()).get().get();
                        if (courseDoc.exists()) {
                            logger.info("Course found in Firebase: {}", e.getCourseId());
                            return courseDoc.toObject(Course.class);
                        } else {
                            logger.warn("Course not found in Firebase: {}", e.getCourseId());
                            return null;
                        }
                    } catch (Exception ex) {
                        logger.error("Failed to fetch course {} from Firebase: {}", e.getCourseId(), ex.getMessage());
                        return null;
                    }
                })
                .filter(c -> c != null)
                .toList();
    }

       public List<Enrollment> getAllEnrollments() throws Exception {
        try {
            Firestore db = FirestoreClient.getFirestore();
            return db.collection(ENROLLMENTS_COLLECTION)
                    .get()
                    .get()
                    .getDocuments()
                    .stream()
                    .map(doc -> doc.toObject(Enrollment.class))
                    .filter(e -> e != null)
                    .collect(java.util.stream.Collectors.toList());
        } catch (Exception e) {
            logger.error("Failed to fetch all enrollments: {}", e.getMessage());
            return new ArrayList<>();
        }
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

        logger.info("Admin enrollment: studentId={}, courseId={}", studentId, courseId);
        
        // Validate course exists (with detailed logging)
        Course course = null;
        try {
            logger.info("Attempting to fetch course from service: {}", courseId);
            course = courseService.getCourseById(courseId);
            
            if (course == null) {
                logger.warn("Course service returned null for courseId: {}", courseId);
                // Try to fetch from Firebase directly as fallback
                logger.info("Attempting fallback: fetching course from Firebase");
                var courseDoc = db.collection("courses").document(courseId).get().get();
                if (courseDoc.exists()) {
                    logger.info("Course found in Firebase");
                    course = courseDoc.toObject(Course.class);
                } else {
                    logger.error("Course not found in Firebase either: {}", courseId);
                    throw new RuntimeException("Course not found. The course may have been deleted.");
                }
            } else {
                logger.info("Course found from service: {}", course.getTitle() != null ? course.getTitle() : course.getId());
            }
            
            // Validate capacity if course found
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
                    logger.warn("Course {} is full ({} / {})", courseId, enrolledCount, max);
                    throw new RuntimeException("Enrollment failed: course is full");
                }
            }
        } catch (RuntimeException e) {
            logger.error("Course validation error: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Failed to validate course: {}", e.getMessage());
            throw new RuntimeException("Failed to validate course: " + e.getMessage());
        }

        // Check duplicate
        try {
            boolean already = !db.collection(ENROLLMENTS_COLLECTION)
                    .whereEqualTo("studentId", studentId)
                    .whereEqualTo("courseId", courseId)
                    .get().get().isEmpty();

            if (already) {
                logger.warn("Student {} already enrolled in course {}", studentId, courseId);
                throw new RuntimeException("Student already enrolled in this course");
            }
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Failed to check enrollment: {}", e.getMessage());
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

            logger.info("Admin enrollment completed: {}", enrollment.getId());
            return enrollment;
        } catch (Exception e) {
            logger.error("Failed to save enrollment: {}", e.getMessage());
            throw new RuntimeException("Failed to save enrollment: " + e.getMessage());
        }
    }

    // ==================== BROWSE ALL ACTIVE COURSES ====================
    public List<Course> getAllActiveCourses() {
        return courseService.getAllActiveCourses();
    }

    // ==================== ENROLLMENT STATS ====================
    public EnrollmentStats getEnrollmentStats() throws Exception {
        try {
            Firestore db = FirestoreClient.getFirestore();

            long now = System.currentTimeMillis();
            long weekAgo = now - 7L * 24 * 60 * 60 * 1000;
            long monthAgo = now - 30L * 24 * 60 * 60 * 1000;

            logger.info("Calculating enrollment stats - now: {}, weekAgo: {}, monthAgo: {}", now, weekAgo, monthAgo);

            // Fetch all enrolled enrollments (avoids composite index requirement)
            // Then filter by createdAt in application code
            List<Enrollment> allEnrolled = db.collection(ENROLLMENTS_COLLECTION)
                    .whereEqualTo("status", "enrolled")
                    .get().get().getDocuments()
                    .stream()
                    .map(d -> d.toObject(Enrollment.class))
                    .filter(e -> e != null && e.getCreatedAt() > 0)
                    .toList();

            // Filter for recent enrollments (last 30 days) in application code
            List<Enrollment> recent = allEnrolled.stream()
                    .filter(e -> e.getCreatedAt() >= monthAgo)
                    .toList();

            logger.info("Found {} recent enrollments", recent.size());

            int monthlyCount = recent.size();

            // weekly count = those with createdAt >= weekAgo
            int weeklyCount = 0;
            for (Enrollment e : recent) {
                if (e != null && e.getCreatedAt() >= weekAgo) {
                    weeklyCount++;
                }
            }

            logger.info("Weekly count: {}, Monthly count: {}", weeklyCount, monthlyCount);

            // daily counts for last 7 days
            Map<String, Integer> dayMap = new HashMap<>();
            DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd").withZone(ZoneId.systemDefault());
            
            // Initialize dayMap with last 7 days
            for (int i = 6; i >= 0; --i) {
                long dayStart = now - (i * 24L * 60 * 60 * 1000);
                String label = fmt.format(Instant.ofEpochMilli(dayStart));
                dayMap.put(label, 0);
                logger.debug("Initialized day {}: {}", i, label);
            }

            // Aggregate enrollments by day
            for (Enrollment e : recent) {
                if (e != null && e.getCreatedAt() > 0) {
                    String d = fmt.format(Instant.ofEpochMilli(e.getCreatedAt()));
                    dayMap.put(d, dayMap.getOrDefault(d, 0) + 1);
                }
            }

            List<String> labels = new ArrayList<>();
            List<Integer> counts = new ArrayList<>();
            // ensure ordered by date ascending
            for (int i = 6; i >= 0; --i) {
                long dayStart = now - (i * 24L * 60 * 60 * 1000);
                String label = fmt.format(Instant.ofEpochMilli(dayStart));
                labels.add(label);
                counts.add(dayMap.getOrDefault(label, 0));
                logger.debug("Day label: {}, count: {}", label, dayMap.getOrDefault(label, 0));
            }

            EnrollmentStats stats = new EnrollmentStats();
            stats.setMonthlyCount(monthlyCount);
            stats.setWeeklyCount(weeklyCount);
            stats.setDailyLabels(labels);
            stats.setDailyCounts(counts);
            
            logger.info("Enrollment stats calculated successfully");
            return stats;
        } catch (Exception e) {
            logger.error("Error calculating enrollment stats", e);
            throw new RuntimeException("Failed to calculate enrollment stats: " + e.getMessage(), e);
        }
    }
}