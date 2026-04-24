package app.service;

import app.model.Lesson;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class LessonService {

    private static final String COLLECTION = "lessons";
    private static final Logger logger = LoggerFactory.getLogger(LessonService.class);

    public String createLesson(Lesson lesson) throws Exception {
        try {
            if (lesson.getId() == null || lesson.getId().isEmpty()) {
                lesson.setId(UUID.randomUUID().toString());
            }

            Firestore db = FirestoreClient.getFirestore();
            db.collection(COLLECTION).document(lesson.getId()).set(lesson).get();

            logger.info("Lesson created: {} for module: {}", lesson.getId(), lesson.getModuleId());
            return lesson.getId();
        } catch (Exception e) {
            logger.error("Error creating lesson: {}", e.getMessage(), e);
            throw e;
        }
    }

    public Lesson getLesson(String lessonId) throws Exception {
        try {
            Firestore db = FirestoreClient.getFirestore();
            Lesson lesson = db.collection(COLLECTION).document(lessonId)
                    .get()
                    .get()
                    .toObject(Lesson.class);

            logger.info("Lesson retrieved: {}", lessonId);
            return lesson;
        } catch (Exception e) {
            logger.error("Error getting lesson: {}", e.getMessage(), e);
            throw e;
        }
    }

    public List<Lesson> getLessonsByModule(String moduleId) throws Exception {
        try {
            Firestore db = FirestoreClient.getFirestore();
            List<Lesson> lessons = db.collection(COLLECTION)
                    .whereEqualTo("moduleId", moduleId)
                    //.orderBy("orderNo")
                    .get()
                    .get()
                    .toObjects(Lesson.class);

            logger.info("Retrieved {} lessons for module: {}", lessons.size(), moduleId);
            return lessons;
        } catch (Exception e) {
            logger.error("Error getting lessons for module {}: {}", moduleId, e.getMessage(), e);
            throw e;
        }
    }

    public void updateLesson(String lessonId, Lesson lesson) throws Exception {
        try {
            lesson.setUpdatedAt(System.currentTimeMillis());
            Firestore db = FirestoreClient.getFirestore();
            db.collection(COLLECTION).document(lessonId).set(lesson).get();

            logger.info("Lesson updated: {}", lessonId);
        } catch (Exception e) {
            logger.error("Error updating lesson: {}", e.getMessage(), e);
            throw e;
        }
    }

    public void deleteLesson(String lessonId) throws Exception {
        try {
            Firestore db = FirestoreClient.getFirestore();
            db.collection(COLLECTION).document(lessonId).delete().get();

            logger.info("Lesson deleted: {}", lessonId);
        } catch (Exception e) {
            logger.error("Error deleting lesson: {}", e.getMessage(), e);
            throw e;
        }
    }

    public void reorderLessons(String moduleId, List<String> lessonIds) throws Exception {
        try {
            Firestore db = FirestoreClient.getFirestore();
            for (int i = 0; i < lessonIds.size(); i++) {
                Lesson lesson = getLesson(lessonIds.get(i));
                lesson.setOrderNo(i + 1);
                lesson.setUpdatedAt(System.currentTimeMillis());
                db.collection(COLLECTION).document(lessonIds.get(i)).set(lesson).get();
            }

            logger.info("Lessons reordered for module: {}", moduleId);
        } catch (Exception e) {
            logger.error("Error reordering lessons: {}", e.getMessage(), e);
            throw e;
        }
    }
}
