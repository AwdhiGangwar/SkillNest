package app.service;

import app.model.Progress;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ProgressService {

    private static final String COLLECTION = "progress";
    private static final Logger logger = LoggerFactory.getLogger(ProgressService.class);

    public String createProgress(Progress progress) throws Exception {
        try {
            if (progress.getId() == null || progress.getId().isEmpty()) {
                progress.setId(UUID.randomUUID().toString());
            }

            Firestore db = FirestoreClient.getFirestore();
            db.collection(COLLECTION).document(progress.getId()).set(progress).get();

            logger.info("Progress created for student: {}, lesson: {}", progress.getStudentId(), progress.getLessonId());
            return progress.getId();
        } catch (Exception e) {
            logger.error("Error creating progress: {}", e.getMessage(), e);
            throw e;
        }
    }

    public Progress getProgress(String progressId) throws Exception {
        try {
            Firestore db = FirestoreClient.getFirestore();
            Progress progress = db.collection(COLLECTION).document(progressId)
                    .get()
                    .get()
                    .toObject(Progress.class);

            return progress;
        } catch (Exception e) {
            logger.error("Error getting progress: {}", e.getMessage(), e);
            throw e;
        }
    }

    public Progress getProgressByLessonAndStudent(String studentId, String lessonId) throws Exception {
        try {
            Firestore db = FirestoreClient.getFirestore();
            List<Progress> progressList = db.collection(COLLECTION)
                    .whereEqualTo("studentId", studentId)
                    .whereEqualTo("lessonId", lessonId)
                    .get()
                    .get()
                    .toObjects(Progress.class);

            if (progressList.isEmpty()) {
                return null;
            }
            return progressList.get(0);
        } catch (Exception e) {
            logger.error("Error getting progress for student {}, lesson {}: {}", studentId, lessonId, e.getMessage(), e);
            throw e;
        }
    }

    public List<Progress> getProgressByCourse(String studentId, String courseId) throws Exception {
        try {
            Firestore db = FirestoreClient.getFirestore();
            List<Progress> progressList = db.collection(COLLECTION)
                    .whereEqualTo("studentId", studentId)
                    .whereEqualTo("courseId", courseId)
                    .get()
                    .get()
                    .toObjects(Progress.class);

            logger.info("Retrieved {} progress items for student: {}, course: {}", progressList.size(), studentId, courseId);
            return progressList;
        } catch (Exception e) {
            logger.error("Error getting course progress: {}", e.getMessage(), e);
            throw e;
        }
    }

    public void markLessonComplete(String studentId, String courseId, String lessonId) throws Exception {
        try {
            Progress progress = getProgressByLessonAndStudent(studentId, lessonId);

            if (progress == null) {
                progress = new Progress(UUID.randomUUID().toString(), studentId, courseId, lessonId);
            }

            progress.setCompleted(true);

            Firestore db = FirestoreClient.getFirestore();
            db.collection(COLLECTION).document(progress.getId()).set(progress).get();

            logger.info("Lesson marked complete for student: {}, lesson: {}", studentId, lessonId);
        } catch (Exception e) {
            logger.error("Error marking lesson complete: {}", e.getMessage(), e);
            throw e;
        }
    }

    public void updateProgress(String progressId, Progress progress) throws Exception {
        try {
            progress.setUpdatedAt(System.currentTimeMillis());
            Firestore db = FirestoreClient.getFirestore();
            db.collection(COLLECTION).document(progressId).set(progress).get();

            logger.info("Progress updated: {}", progressId);
        } catch (Exception e) {
            logger.error("Error updating progress: {}", e.getMessage(), e);
            throw e;
        }
    }

    public double getCourseProgress(String studentId, String courseId, int totalLessons) throws Exception {
        try {
            List<Progress> progressList = getProgressByCourse(studentId, courseId);
            long completedCount = progressList.stream()
                    .filter(Progress::isCompleted)
                    .count();

            if (totalLessons == 0) {
                return 0;
            }

            double percentage = (completedCount * 100.0) / totalLessons;
            logger.info("Course progress for student {}: {}", studentId, percentage);
            return Math.round(percentage * 100.0) / 100.0;
        } catch (Exception e) {
            logger.error("Error calculating course progress: {}", e.getMessage(), e);
            throw e;
        }
    }
}
