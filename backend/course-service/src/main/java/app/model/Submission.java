package app.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Submission {

    private String id;
    private String assignmentId;
    private String studentId;
    private String fileUrl;
    private String fileName;
    private String submittedAt;
    private String status; // submitted, reviewed, graded
    private String feedback;
    private int grade;
    private long createdAt;

    public Submission() {
        this.createdAt = System.currentTimeMillis();
        this.status = "submitted";
    }

    // Getters
    public String getId() { return id; }
    public String getAssignmentId() { return assignmentId; }
    public String getStudentId() { return studentId; }
    public String getFileUrl() { return fileUrl; }
    public String getFileName() { return fileName; }
    public String getSubmittedAt() { return submittedAt; }
    public String getStatus() { return status; }
    public String getFeedback() { return feedback; }
    public int getGrade() { return grade; }
    public long getCreatedAt() { return createdAt; }

    // Setters
    public void setId(String id) { this.id = id; }
    public void setAssignmentId(String assignmentId) { this.assignmentId = assignmentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public void setSubmittedAt(String submittedAt) { this.submittedAt = submittedAt; }
    public void setStatus(String status) { this.status = status; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
    public void setGrade(int grade) { this.grade = grade; }
    public void setCreatedAt(long createdAt) { this.createdAt = createdAt; }
}