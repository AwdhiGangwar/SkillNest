package app.controller;
import app.model.Course;
import app.model.Enrollment;
import app.model.User;
import app.service.EnrollmentService;
import app.service.CourseService;
import app.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import app.model.EnrollmentRequest;
import app.model.EnrollmentRequestDto;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import app.model.EnrollmentStats;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api")

public class EnrollmentController {

    private static final Logger logger = LoggerFactory.getLogger(EnrollmentController.class);

    @Autowired
    private EnrollmentService enrollmentService;
    
    @Autowired
    private CourseService courseService;
    
    @Autowired
    private UserService userService;

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Enrollment Service is running 🚀");
    }

    @PostMapping("/enrollments")
    public ResponseEntity<?> enroll(@RequestBody Enrollment enrollment,
                                   HttpServletRequest request) {
        try {
            String token = request.getHeader("Authorization");

            if (token == null || !token.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Missing or invalid Authorization header");
            }

            Enrollment result = enrollmentService.enroll(enrollment, token);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Something went wrong while enrolling");
        }
    }

    @GetMapping("/my-courses")
    public ResponseEntity<?> getMyCourses(HttpServletRequest request) {
        try {
            String uid = (String) request.getAttribute("uid");

            if (uid == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Unauthorized: UID missing");
            }

            List<Course> courses = enrollmentService.getMyCourses(uid);
            return ResponseEntity.ok(courses);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to fetch enrolled courses");
        }
    }

    @GetMapping("/enrollments/course/{courseId}")
    public ResponseEntity<?> getEnrollmentsByCourse(@PathVariable String courseId) {
        try {
            List<app.model.Enrollment> list = enrollmentService.getEnrollmentsByCourse(courseId);
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to fetch enrollments for course");
        }
    }

    @GetMapping("/enrollments/stats")
    public ResponseEntity<?> getEnrollmentStats() {
        try {
            EnrollmentStats stats = enrollmentService.getEnrollmentStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to compute enrollment stats");
        }
    }

    // ==================== Enrollment Requests ====================
    @PostMapping("/enrollment-requests")
    public ResponseEntity<?> createEnrollmentRequest(@RequestBody EnrollmentRequest req, HttpServletRequest request) {
        try {
            String uid = (String) request.getAttribute("uid");
            if (uid == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");

            Firestore db = FirestoreClient.getFirestore();
            if (req.getCourseId() == null || req.getCourseId().isEmpty()) {
                return ResponseEntity.badRequest().body("courseId is required");
            }

            req.setId(UUID.randomUUID().toString());
            req.setStudentId(uid);
            req.setStatus("pending");
            req.setCreatedAt(System.currentTimeMillis());

            db.collection("enrollment_requests").document(req.getId()).set(req).get();
            return ResponseEntity.status(HttpStatus.CREATED).body(req);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create request");
        }
    }

    @GetMapping("/enrollment-requests")
    public ResponseEntity<?> listEnrollmentRequests() {
        try {
            Firestore db = FirestoreClient.getFirestore();
            List<EnrollmentRequest> list = db.collection("enrollment_requests").get().get().getDocuments()
                    .stream().map(d -> d.toObject(EnrollmentRequest.class)).toList();
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch requests");
        }
    }

    @GetMapping("/enrollment-requests/enriched/all")
    public ResponseEntity<?> listEnrollmentRequestsEnriched() {
        try {
            Firestore db = FirestoreClient.getFirestore();
            List<EnrollmentRequest> list = db.collection("enrollment_requests").get().get().getDocuments()
                    .stream().map(d -> d.toObject(EnrollmentRequest.class)).toList();
            
            // Enrich each request with student and course details
            List<EnrollmentRequestDto> enriched = list.stream().map(req -> {
                String studentName = "Unknown";
                String studentEmail = "unknown@example.com";
                String courseName = "Unknown Course";
                
                // Fetch student details
                if (req.getStudentId() != null) {
                    User user = userService.getUserById(req.getStudentId());
                    if (user != null) {
                        studentName = user.getName() != null ? user.getName() : user.getId();
                        studentEmail = user.getEmail() != null ? user.getEmail() : "unknown@example.com";
                    }
                }
                
                // Fetch course details
                if (req.getCourseId() != null) {
                    Course course = courseService.getCourseById(req.getCourseId());
                    if (course != null) {
                        courseName = course.getTitle() != null ? course.getTitle() : "Unknown Course";
                    }
                }
                
                return new EnrollmentRequestDto(req, studentName, studentEmail, courseName);
            }).collect(Collectors.toList());
            
            return ResponseEntity.ok(enriched);
        } catch (Exception e) {
            logger.error("Failed to fetch enriched requests", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch requests");
        }
    }

    @PostMapping("/enrollment-requests/{id}/approve")
    public ResponseEntity<?> approveRequest(@PathVariable String id, HttpServletRequest request) {
        try {
            String adminUid = (String) request.getAttribute("uid");
            if (adminUid == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");

            Firestore db = FirestoreClient.getFirestore();
            var doc = db.collection("enrollment_requests").document(id).get().get();
            if (!doc.exists()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Request not found");

            EnrollmentRequest req = doc.toObject(EnrollmentRequest.class);
            if (req == null) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Invalid request data");
            if (!"pending".equalsIgnoreCase(req.getStatus())) return ResponseEntity.badRequest().body("Request already processed");

            logger.info("Processing enrollment request: {} for student: {} in course: {}", id, req.getStudentId(), req.getCourseId());

            // Create enrollment (enrollAsAdmin will validate course exists)
            Enrollment e = enrollmentService.enrollAsAdmin(req.getStudentId(), req.getCourseId());

            // Update request
            req.setStatus("approved");
            req.setProcessedAt(System.currentTimeMillis());
            req.setProcessedBy(adminUid);
            db.collection("enrollment_requests").document(id).set(req).get();

            logger.info("Enrollment request approved: {}", id);
            return ResponseEntity.ok(e);
        } catch (RuntimeException re) {
            logger.error("RuntimeException during approval: {}", re.getMessage());
            return ResponseEntity.badRequest().body(re.getMessage());
        } catch (Exception e) {
            logger.error("Exception during approval: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to approve request: " + e.getMessage());
        }
    }

    @PostMapping("/enrollment-requests/{id}/reject")
    public ResponseEntity<?> rejectRequest(@PathVariable String id, @RequestBody(required = false) String reason, HttpServletRequest request) {
        try {
            String adminUid = (String) request.getAttribute("uid");
            if (adminUid == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");

            Firestore db = FirestoreClient.getFirestore();
            var doc = db.collection("enrollment_requests").document(id).get().get();
            if (!doc.exists()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Request not found");
            EnrollmentRequest req = doc.toObject(EnrollmentRequest.class);
            if (req == null) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Invalid request data");
            if (!"pending".equalsIgnoreCase(req.getStatus())) return ResponseEntity.badRequest().body("Request already processed");

            req.setStatus("rejected");
            req.setProcessedAt(System.currentTimeMillis());
            req.setProcessedBy(adminUid);
            db.collection("enrollment_requests").document(id).set(req).get();

            return ResponseEntity.ok(req);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to reject request");
        }
    }
}