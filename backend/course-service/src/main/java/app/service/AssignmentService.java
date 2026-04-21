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

            logger.info("Assignment created: {} for lesson: {}", assignment.getId(), assignment.getLessonId());
            return assignment.getId();
        } catch (Exception e) {
            logger.error("Error creating assignment: {}", e.getMessage(), e);
            throw e;
        }
    }

    public Assignment getAssignment(String assignmentId) throws Exception {
        try {
            Firestore db = FirestoreClient.getFirestore();
            Assignment assignment = db.collection(COLLECTION).document(assignmentId)
                    .get()
                    .get()
                    .toObject(Assignment.class);

            return assignment;
        } catch (Exception e) {
            logger.error("Error getting assignment: {}", e.getMessage(), e);
            throw e;
        }
    }

    public List<Assignment> getAssignmentsByLesson(String lessonId) throws Exception {
        try {
            Firestore db = FirestoreClient.getFirestore();
            List<Assignment> assignments = db.collection(COLLECTION)
                    .whereEqualTo("lessonId", lessonId)
                    .orderBy("orderNo")
                    .get()
                    .get()
                    .toObjects(Assignment.class);

            logger.info("Retrieved {} assignments for lesson: {}", assignments.size(), lessonId);
            return assignments;
        } catch (Exception e) {
            logger.error("Error getting assignments for lesson {}: {}", lessonId, e.getMessage(), e);
            throw e;
        }
    }

    public void updateAssignment(String assignmentId, Assignment assignment) throws Exception {
        try {
            assignment.setUpdatedAt(System.currentTimeMillis());
            Firestore db = FirestoreClient.getFirestore();
            db.collection(COLLECTION).document(assignmentId).set(assignment).get();

            logger.info("Assignment updated: {}", assignmentId);
        } catch (Exception e) {
            logger.error("Error updating assignment: {}", e.getMessage(), e);
            throw e;
        }
    }

    public void deleteAssignment(String assignmentId) throws Exception {
        try {
            Firestore db = FirestoreClient.getFirestore();
            db.collection(COLLECTION).document(assignmentId).delete().get();

            logger.info("Assignment deleted: {}", assignmentId);
        } catch (Exception e) {
            logger.error("Error deleting assignment: {}", e.getMessage(), e);
            throw e;
        }
    }
}
