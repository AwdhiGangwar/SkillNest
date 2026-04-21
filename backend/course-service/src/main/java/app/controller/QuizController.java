package app.controller;

import app.model.Quiz;
import app.service.QuizService;
import app.service.CourseService;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @Autowired
    private CourseService courseService;

    private static final Logger logger = LoggerFactory.getLogger(QuizController.class);

    @PostMapping
    public ResponseEntity<?> createQuiz(@RequestBody Quiz quiz, HttpServletRequest request) {
        try {
            String uid = (String) request.getAttribute("uid");
            String token = request.getHeader("Authorization");

            logger.info("Quiz creation request from UID: {}", uid);

            if (!courseService.isTeacher(uid, token)) {
                logger.warn("User {} is not authorized to create quizzes", uid);
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Only teachers or admins can create quizzes"));
            }

            String quizId = quizService.createQuiz(quiz);
            return ResponseEntity.ok(Map.of("success", true, "quizId", quizId));
        } catch (Exception e) {
            logger.error("Error creating quiz: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create quiz: " + e.getMessage()));
        }
    }

    @GetMapping("/{quizId}")
    public ResponseEntity<?> getQuiz(@PathVariable String quizId) {
        try {
            Quiz quiz = quizService.getQuiz(quizId);
            if (quiz == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(quiz);
        } catch (Exception e) {
            logger.error("Error getting quiz: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to get quiz: " + e.getMessage()));
        }
    }

    @GetMapping("/lesson/{lessonId}")
    public ResponseEntity<?> getQuizzesByLesson(@PathVariable String lessonId) {
        try {
            List<Quiz> quizzes = quizService.getQuizzesByLesson(lessonId);
            return ResponseEntity.ok(quizzes);
        } catch (Exception e) {
            logger.error("Error getting quizzes for lesson: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to get quizzes: " + e.getMessage()));
        }
    }

    @PutMapping("/{quizId}")
    public ResponseEntity<?> updateQuiz(@PathVariable String quizId, @RequestBody Quiz quiz, HttpServletRequest request) {
        try {
            String uid = (String) request.getAttribute("uid");
            String token = request.getHeader("Authorization");

            logger.info("Quiz update request from UID: {}", uid);

            if (!courseService.isTeacher(uid, token)) {
                logger.warn("User {} is not authorized to update quizzes", uid);
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Only teachers or admins can update quizzes"));
            }

            quiz.setId(quizId);
            quizService.updateQuiz(quizId, quiz);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            logger.error("Error updating quiz: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update quiz: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{quizId}")
    public ResponseEntity<?> deleteQuiz(@PathVariable String quizId, HttpServletRequest request) {
        try {
            String uid = (String) request.getAttribute("uid");
            String token = request.getHeader("Authorization");

            logger.info("Quiz deletion request from UID: {}", uid);

            if (!courseService.isTeacher(uid, token)) {
                logger.warn("User {} is not authorized to delete quizzes", uid);
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Only teachers or admins can delete quizzes"));
            }

            quizService.deleteQuiz(quizId);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            logger.error("Error deleting quiz: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to delete quiz: " + e.getMessage()));
        }
    }
}
