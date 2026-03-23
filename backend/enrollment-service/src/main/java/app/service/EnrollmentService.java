package app.service;

import app.model.Course;
import app.model.Enrollment;
import app.model.User;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class EnrollmentService {

    private static final String COLLECTION = "enrollments";

    @Autowired
    private RestTemplate restTemplate;

    // ✅ ENROLL (role check + course validation + duplicate check)
    public String enroll(Enrollment enrollment, String token) throws Exception {

        Firestore db = FirestoreClient.getFirestore();

        // 🔥 STEP 1: Check user role (only student allowed)
        String userUrl = "http://localhost:8081/api/me";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", token);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<User> response =
                restTemplate.exchange(userUrl, HttpMethod.GET, entity, User.class);

        User user = response.getBody();

        if (user == null || !"student".equals(user.getRole())) {
            return "Only students can enroll ❌";
        }

        // 🔥 STEP 2: Check course exists
        String courseUrl = "http://localhost:8082/api/courses/" + enrollment.getCourseId();

        Course course = restTemplate.getForObject(courseUrl, Course.class);

        if (course == null) {
            return "Course not found ❌";
        }

        // 🔥 STEP 3: Duplicate check
        QuerySnapshot snapshot = db.collection(COLLECTION)
                .whereEqualTo("studentId", enrollment.getStudentId())
                .whereEqualTo("courseId", enrollment.getCourseId())
                .get()
                .get();

        if (!snapshot.isEmpty()) {
            return "Already enrolled ❌";
        }

        // ✅ STEP 4: Save enrollment
        db.collection(COLLECTION)
                .document(enrollment.getId())
                .set(enrollment)
                .get();

        return "Enrollment successful 🎉";
    }

    // ✅ STUDENT DASHBOARD (optimized)
    public List<Course> getMyCourses(String studentId) throws Exception {

        Firestore db = FirestoreClient.getFirestore();

        // 🔥 Step 1: get enrollments
        List<Enrollment> enrollments = db.collection(COLLECTION)
                .whereEqualTo("studentId", studentId)
                .get()
                .get()
                .getDocuments()
                .stream()
                .map(doc -> doc.toObject(Enrollment.class))
                .toList();

        List<Course> myCourses = new ArrayList<>();

        // 🔥 Step 2: fetch each course by ID (optimized)
        for (Enrollment e : enrollments) {

            String url = "http://localhost:8082/api/courses/" + e.getCourseId();

            Course course = restTemplate.getForObject(url, Course.class);

            if (course != null) {
                myCourses.add(course);
            }
        }

        return myCourses;
    }
}