package app.service;

import app.model.Quiz;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class QuizService {

    private static final String COLLECTION = "quizzes";
    private static final Logger logger = LoggerFactory.getLogger(QuizService.class);

    public String createQuiz(Quiz quiz) throws Exception {
        try {
            if (quiz.getId() == null || quiz.getId().isEmpty()) {
                quiz.setId(UUID.randomUUID().toString());
            }

            Firestore db = FirestoreClient.getFirestore();
            db.collection(COLLECTION).document(quiz.getId()).set(quiz).get();

            logger.info("Quiz created: {} for lesson: {}", quiz.getId(), quiz.getLessonId());
            return quiz.getId();
        } catch (Exception e) {
            logger.error("Error creating quiz: {}", e.getMessage(), e);
            throw e;
        }
    }

    public Quiz getQuiz(String quizId) throws Exception {
        try {
            Firestore db = FirestoreClient.getFirestore();
            Quiz quiz = db.collection(COLLECTION).document(quizId)
                    .get()
                    .get()
                    .toObject(Quiz.class);

            return quiz;
        } catch (Exception e) {
            logger.error("Error getting quiz: {}", e.getMessage(), e);
            throw e;
        }
    }

    public List<Quiz> getQuizzesByLesson(String lessonId) throws Exception {
        try {
            Firestore db = FirestoreClient.getFirestore();
            List<Quiz> quizzes = db.collection(COLLECTION)
                    .whereEqualTo("lessonId", lessonId)
                    .orderBy("orderNo")
                    .get()
                    .get()
                    .toObjects(Quiz.class);

            logger.info("Retrieved {} quizzes for lesson: {}", quizzes.size(), lessonId);
            return quizzes;
        } catch (Exception e) {
            logger.error("Error getting quizzes for lesson {}: {}", lessonId, e.getMessage(), e);
            throw e;
        }
    }

    public void updateQuiz(String quizId, Quiz quiz) throws Exception {
        try {
            quiz.setUpdatedAt(System.currentTimeMillis());
            Firestore db = FirestoreClient.getFirestore();
            db.collection(COLLECTION).document(quizId).set(quiz).get();

            logger.info("Quiz updated: {}", quizId);
        } catch (Exception e) {
            logger.error("Error updating quiz: {}", e.getMessage(), e);
            throw e;
        }
    }

    public void deleteQuiz(String quizId) throws Exception {
        try {
            Firestore db = FirestoreClient.getFirestore();
            db.collection(COLLECTION).document(quizId).delete().get();

            logger.info("Quiz deleted: {}", quizId);
        } catch (Exception e) {
            logger.error("Error deleting quiz: {}", e.getMessage(), e);
            throw e;
        }
    }
}
