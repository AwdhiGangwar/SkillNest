package app.model;

public class Enrollment {

    private String id;
    private String studentId;
    private String courseId;
    private long createdAt;

    public Enrollment() {
        this.createdAt = System.currentTimeMillis();
    }

    public Enrollment(String id, String studentId, String courseId) {
        this.id = id;
        this.studentId = studentId;
        this.courseId = courseId;
        this.createdAt = System.currentTimeMillis();
    }

    // GETTERS

    public String getId() {
        return id;
    }

    public String getStudentId() {
        return studentId;
    }

    public String getCourseId() {
        return courseId;
    }

    public long getCreatedAt() {
        return createdAt;
    }

    // SETTERS

    public void setId(String id) {
        this.id = id;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    public void setCreatedAt(long createdAt) {
        this.createdAt = createdAt;
    }
}