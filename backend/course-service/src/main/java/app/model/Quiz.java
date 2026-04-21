package app.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Quiz {

    private String id;
    private String lessonId;
    private String question;
    private List<String> options;
    private int correctAnswer; // index of correct option
    private String explanation;
    private int orderNo;
    private long createdAt;
    private long updatedAt;

    public Quiz() {
        this.createdAt = System.currentTimeMillis();
        this.updatedAt = System.currentTimeMillis();
    }

    public Quiz(String id, String lessonId, String question, List<String> options, int correctAnswer) {
        this.id = id;
        this.lessonId = lessonId;
        this.question = question;
        this.options = options;
        this.correctAnswer = correctAnswer;
        this.createdAt = System.currentTimeMillis();
        this.updatedAt = System.currentTimeMillis();
    }

    // Getters
    public String getId() {
        return id;
    }

    public String getLessonId() {
        return lessonId;
    }

    public String getQuestion() {
        return question;
    }

    public List<String> getOptions() {
        return options;
    }

    public int getCorrectAnswer() {
        return correctAnswer;
    }

    public String getExplanation() {
        return explanation;
    }

    public int getOrderNo() {
        return orderNo;
    }

    public long getCreatedAt() {
        return createdAt;
    }

    public long getUpdatedAt() {
        return updatedAt;
    }

    // Setters
    public void setId(String id) {
        this.id = id;
    }

    public void setLessonId(String lessonId) {
        this.lessonId = lessonId;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public void setOptions(List<String> options) {
        this.options = options;
    }

    public void setCorrectAnswer(int correctAnswer) {
        this.correctAnswer = correctAnswer;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public void setOrderNo(int orderNo) {
        this.orderNo = orderNo;
    }

    public void setCreatedAt(long createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(long updatedAt) {
        this.updatedAt = updatedAt;
    }
}
