package app.service;

import app.model.Submission;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class SubmissionService {

    private static final String COLLECTION = "submissions";
    private static final Logger logger = LoggerFactory.getLogger(SubmissionService.class);

    // ✅ Submit assignment
    public Submission createSubmission(Submission submission) throws Exception {
        Firestore db = FirestoreClient.getFirestore();

        submission.setId(UUID.randomUUID().toString());
        submission.setStatus("submitted");
        submission.setCreatedAt(System.currentTimeMillis());

        db.collection(COLLECTION).document(submission.getId()).set(submission).get();
        logger.info("Submission created: {}", submission.getId());
        return submission;
    }

    // ✅ Get submissions by assignment (teacher dekhe)
    public List<Submission> getSubmissionsByAssignment(String assignmentId) throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        return db.collection(COLLECTION)
                .whereEqualTo("assignmentId", assignmentId)
                .get().get().toObjects(Submission.class);
    }

    // ✅ Get submissions by student
    public List<Submission> getSubmissionsByStudent(String studentId) throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        return db.collection(COLLECTION)
                .whereEqualTo("studentId", studentId)
                .get().get().toObjects(Submission.class);
    }

    // ✅ Check already submitted
    public boolean isAlreadySubmitted(String assignmentId, String studentId) throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        return !db.collection(COLLECTION)
                .whereEqualTo("assignmentId", assignmentId)
                .whereEqualTo("studentId", studentId)
                .get().get().isEmpty();
    }
}