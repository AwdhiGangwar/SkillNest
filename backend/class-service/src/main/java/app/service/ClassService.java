package app.service;

import app.model.ClassEntity;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import java.util.ArrayList;
import java.util.stream.Collectors;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.scheduling.annotation.Async;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.List;

@Service
public class ClassService {

    private static final String COLLECTION = "classes";

    @Autowired
private EmailService emailService;

public ClassEntity createClass(ClassEntity classEntity) throws Exception {
    Firestore db = FirestoreClient.getFirestore();
    
    // Save class
    String id = "class_" + UUID.randomUUID();
    classEntity.setId(id);
    db.collection(COLLECTION).document(id).set(classEntity).get();

    // ✅ Enrolled students ko email bhejo
    sendEmailToEnrolledStudents(classEntity);

    return classEntity;
}
@Async
private void sendEmailToEnrolledStudents(ClassEntity classEntity) {
    try {
        Firestore db = FirestoreClient.getFirestore();

        // Enrollments se students fetch karo
        List<QueryDocumentSnapshot> enrollments = db.collection("enrollments")
                .whereEqualTo("courseId", classEntity.getCourseId())
                .get()
                .get()
                .getDocuments();

        for (QueryDocumentSnapshot enrollment : enrollments) {
            String studentId = enrollment.getString("studentId");

            // User collection se email fetch karo
            DocumentSnapshot userDoc = db.collection("users")
                    .document(studentId)
                    .get()
                    .get();

            if (userDoc.exists()) {
                String email = userDoc.getString("email");
                String name = userDoc.getString("name");

                // Email bhejo
                emailService.sendClassNotification(
                    email, name,
                    classEntity.getTitle(),
                    classEntity.getStartTime(),
                    classEntity.getMeetingLink()
                );
            }
        }
    } catch (Exception e) {
        System.err.println("Failed to send notifications: " + e.getMessage());
    }
}
   public List<ClassEntity> getStudentClasses(String studentId) throws Exception {
    Firestore db = FirestoreClient.getFirestore();

    List<QueryDocumentSnapshot> enrollments = db.collection("enrollments")
            .whereEqualTo("studentId", studentId)
            .get()
            .get()
            .getDocuments();

    System.out.println("🔍 StudentId: " + studentId);
    System.out.println("🔍 Enrollments found: " + enrollments.size());

    if (enrollments.isEmpty()) return new ArrayList<>();

    List<String> courseIds = enrollments.stream()
            .map(e -> e.getString("courseId"))
            .filter(id -> id != null)
            .collect(Collectors.toList());

    System.out.println("🔍 CourseIds: " + courseIds);

    List<ClassEntity> allClasses = new ArrayList<>();
    for (String courseId : courseIds) {
        List<ClassEntity> classes = db.collection("classes")
                .whereEqualTo("courseId", courseId)
                .get()
                .get()
                .toObjects(ClassEntity.class);
        
        System.out.println("🔍 Classes for " + courseId + ": " + classes.size());
        allClasses.addAll(classes);
    }

    System.out.println("🔍 Total classes: " + allClasses.size());
    return allClasses;
}
    public List<ClassEntity> getTeacherClasses(String teacherId) throws Exception {
    Firestore db = FirestoreClient.getFirestore();

    // ✅ Step 1: Teacher ke courses fetch karo
    List<QueryDocumentSnapshot> teacherCourses = db.collection("courses")
            .whereEqualTo("teacherId", teacherId)
            .get()
            .get()
            .getDocuments();

    System.out.println("🔍 TeacherId: " + teacherId);
    System.out.println("🔍 Teacher courses found: " + teacherCourses.size());

    if (teacherCourses.isEmpty()) return new ArrayList<>();

    // ✅ Step 2: CourseIds nikalo
    List<String> courseIds = teacherCourses.stream()
            .map(doc -> doc.getString("id"))
            .filter(id -> id != null)
            .collect(Collectors.toList());

    System.out.println("🔍 CourseIds: " + courseIds);

    // ✅ Step 3: Un courses ki classes fetch karo
    List<ClassEntity> allClasses = new ArrayList<>();
    for (String courseId : courseIds) {
        List<ClassEntity> classes = db.collection("classes")
                .whereEqualTo("courseId", courseId)
                .get()
                .get()
                .toObjects(ClassEntity.class);
        allClasses.addAll(classes);
    }

    System.out.println("🔍 Total teacher classes: " + allClasses.size());
    return allClasses;
}
    public List<ClassEntity> getClassesByCourse(String courseId) throws Exception {
    Firestore db = FirestoreClient.getFirestore();
    return db.collection(COLLECTION)
            .whereEqualTo("courseId", courseId)
            .get()
            .get()
            .getDocuments()
            .stream()
            .map(doc -> doc.toObject(ClassEntity.class))
            .toList();
}


public void deleteClass(String id) throws Exception {
    Firestore db = FirestoreClient.getFirestore();
    db.collection(COLLECTION).document(id).delete().get();
}
public void rescheduleClass(String id, ClassEntity updatedClass) throws Exception {
    Firestore db = FirestoreClient.getFirestore();
    
    ClassEntity existing = db.collection(COLLECTION)
            .document(id)
            .get()
            .get()
            .toObject(ClassEntity.class);
    
    if (existing == null) throw new RuntimeException("Class not found");
    
    // ✅ Sirf time aur link update karo
    if (updatedClass.getStartTime() != null) {
        existing.setStartTime(updatedClass.getStartTime());
    }
    if (updatedClass.getMeetingLink() != null) {
        existing.setMeetingLink(updatedClass.getMeetingLink());
    }
    
    db.collection(COLLECTION).document(id).set(existing).get();
}
}