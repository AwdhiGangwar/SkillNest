package app.service;

import app.model.Course;
import app.model.User;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseService {

    private static final String COLLECTION = "courses";

    @Autowired
    private RestTemplate restTemplate;

    public boolean isTeacher(String uid, String token) {
        try {
            String url = "http://localhost:8080/api/me"; // 🔥 use gateway

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", token);

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<User> response =
                    restTemplate.exchange(url, HttpMethod.GET, entity, User.class);

            User user = response.getBody();

            return user != null && "teacher".equalsIgnoreCase(user.getRole());

        } catch (Exception e) {
            return false;
        }
    }

    public String createCourse(Course course) throws Exception {
        Firestore db = FirestoreClient.getFirestore();

        db.collection(COLLECTION)
                .document(course.getId())
                .set(course)
                .get();

        return "Course created successfully";
    }

    public List<Course> getAllCourses() throws Exception {
        Firestore db = FirestoreClient.getFirestore();

        return db.collection(COLLECTION)
                .get()
                .get()
                .getDocuments()
                .stream()
                .map(doc -> doc.toObject(Course.class))
                .collect(Collectors.toList());
    }

    public Course getCourseById(String id) throws Exception {
        Firestore db = FirestoreClient.getFirestore();

        return db.collection(COLLECTION)
                .document(id)
                .get()
                .get()
                .toObject(Course.class);
    }
}