package app.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Progress {

    private String id;
    private String studentId;
    private String courseId;
    private String lessonId;
    private boolean completed;
    private long completedAt;
    private long createdAt;
    private long updatedAt;

    public Progress() {
        this.createdAt = System.currentTimeMillis();
        this.updatedAt = System.currentTimeMillis();
        this.completed = false;
        this.completedAt = 0;
    }

    public Progress(String id, String studentId, String courseId, String lessonId) {
        this.id = id;
        this.studentId = studentId;
        this.courseId = courseId;
        this.lessonId = lessonId;
        this.completed = false;
        this.completedAt = 0;
        this.createdAt = System.currentTimeMillis();
        this.updatedAt = System.currentTimeMillis();
    }

    // Getters
    public String getId() {
        return id;
    }

    public String getStudentId() {
        return studentId;
    }

    public String getCourseId() {
        return courseId;
    }

    public String getLessonId() {
        return lessonId;
    }

    public boolean isCompleted() {
        return completed;
    }

    public long getCompletedAt() {
        return completedAt;
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

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    public void setLessonId(String lessonId) {
        this.lessonId = lessonId;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
        if (completed) {
            this.completedAt = System.currentTimeMillis();
        }
        this.updatedAt = System.currentTimeMillis();
    }

    public void setCompletedAt(long completedAt) {
        this.completedAt = completedAt;
    }

    public void setCreatedAt(long createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(long updatedAt) {
        this.updatedAt = updatedAt;
    }
}
