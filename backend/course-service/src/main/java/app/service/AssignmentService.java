package app.service;

import app.model.Assignment;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AssignmentService {

    private static final String COLLECTION = "assignments";
    private static final Logger logger = LoggerFactory.getLogger(AssignmentService.class);

    public String createAssignment(Assignment assignment) throws Exception {
        try {
            if (assignment.getId() == null || assignment.getId().isEmpty()) {
                assignment.setId(UUID.randomUUID().toString());
            }

            Firestore db = FirestoreClient.getFirestore();
            db.collection(COLLECTION).document(assignment.getId()).set(assignment).get();

            logger.info("Assignment created: {}", assignment.getId());
            return assignment.getId();
        } catch (Exception e) {
            logger.error("Error creating assignment: {}", e.getMessage(), e);
            throw e;
        }
    }

    public Assignment getAssignment(String assignmentId) throws Exception {
        try {
            Firestore db = FirestoreClient.getFirestore();
            return db.collection(COLLECTION).document(assignmentId)
                    .get().get().toObject(Assignment.class);
        } catch (Exception e) {
            logger.error("Error getting assignment: {}", e.getMessage(), e);
            throw e;
        }
    }

  public List<Assignment> getAssignmentsByCourse(String courseId) throws Exception {
    Firestore db = FirestoreClient.getFirestore();
    return db.collection(COLLECTION)
            .whereEqualTo("courseId", courseId)
            .get().get().toObjects(Assignment.class);
}
// ✅ orderBy hata do
public List<Assignment> getAssignmentsByLesson(String lessonId) throws Exception {
    Firestore db = FirestoreClient.getFirestore();
    return db.collection(COLLECTION)
            .whereEqualTo("lessonId", lessonId)
            // .orderBy("orderNo") ← removed
            .get().get().toObjects(Assignment.class);
}

    public void updateAssignment(String assignmentId, Assignment assignment) throws Exception {
        try {
            assignment.setUpdatedAt(System.currentTimeMillis());
            Firestore db = FirestoreClient.getFirestore();
            db.collection(COLLECTION).document(assignmentId).set(assignment).get();
        } catch (Exception e) {
            logger.error("Error updating assignment: {}", e.getMessage(), e);
            throw e;
        }
    }

    public void deleteAssignment(String assignmentId) throws Exception {
        try {
            Firestore db = FirestoreClient.getFirestore();
            db.collection(COLLECTION).document(assignmentId).delete().get();
        } catch (Exception e) {
            logger.error("Error deleting assignment: {}", e.getMessage(), e);
            throw e;
        }
    }
}