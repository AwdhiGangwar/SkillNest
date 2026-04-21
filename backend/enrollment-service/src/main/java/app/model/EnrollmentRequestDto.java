package app.model;

public class EnrollmentRequestDto {
    
    private String id;
    private String studentId;
    private String studentName;
    private String studentEmail;
    private String courseId;
    private String courseName;
    private String courseTitle;
    private String message;
    private String status;
    private long createdAt;
    private long processedAt;
    private String processedBy;

    public EnrollmentRequestDto() {}

    public EnrollmentRequestDto(EnrollmentRequest req, String studentName, String studentEmail, 
                              String courseTitle) {
        this.id = req.getId();
        this.studentId = req.getStudentId();
        this.studentName = studentName;
        this.studentEmail = studentEmail;
        this.courseId = req.getCourseId();
        this.courseName = courseTitle;
        this.courseTitle = courseTitle;
        this.message = req.getMessage();
        this.status = req.getStatus();
        this.createdAt = req.getCreatedAt();
        this.processedAt = req.getProcessedAt();
        this.processedBy = req.getProcessedBy();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public String getCourseId() { return courseId; }
    public void setCourseId(String courseId) { this.courseId = courseId; }

    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }

    public String getCourseTitle() { return courseTitle; }
    public void setCourseTitle(String courseTitle) { this.courseTitle = courseTitle; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public long getCreatedAt() { return createdAt; }
    public void setCreatedAt(long createdAt) { this.createdAt = createdAt; }

    public long getProcessedAt() { return processedAt; }
    public void setProcessedAt(long processedAt) { this.processedAt = processedAt; }

    public String getProcessedBy() { return processedBy; }
    public void setProcessedBy(String processedBy) { this.processedBy = processedBy; }
}
