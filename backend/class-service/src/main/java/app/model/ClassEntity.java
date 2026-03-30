package app.model;

public class ClassEntity {

    private String id;
    private String studentId;
    private String teacherId;
    private String courseId;
    private long scheduledAt;
    private String status; // scheduled, completed, cancelled

    // 🔹 Default Constructor (IMPORTANT for Firestore)
    public ClassEntity() {
    }

    // 🔹 Parameterized Constructor
    public ClassEntity(String id, String studentId, String teacherId,
                       String courseId, long scheduledAt, String status) {
        this.id = id;
        this.studentId = studentId;
        this.teacherId = teacherId;
        this.courseId = courseId;
        this.scheduledAt = scheduledAt;
        this.status = status;
    }

    // 🔹 Getters & Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(String teacherId) {
        this.teacherId = teacherId;
    }

    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    public long getScheduledAt() {
        return scheduledAt;
    }

    public void setScheduledAt(long scheduledAt) {
        this.scheduledAt = scheduledAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}