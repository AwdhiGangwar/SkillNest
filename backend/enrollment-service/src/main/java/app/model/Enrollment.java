package app.model;

import com.google.cloud.firestore.annotation.DocumentId;
import java.time.Instant;

public class Enrollment {

    @DocumentId
    private String id;
    private String studentId;
    private String courseId;
    private Instant enrollmentDate = Instant.now();
    private long createdAt;
    private String status = "enrolled";
    private String paymentStatus = "pending";
    private double amountPaid;
    private String paymentId;

    public Enrollment() {
        this.createdAt = System.currentTimeMillis();
    }

    public Enrollment(String id, String studentId, String courseId, double amountPaid) {
        this.id = id;
        this.studentId = studentId;
        this.courseId = courseId;
        this.amountPaid = amountPaid;
        this.createdAt = System.currentTimeMillis();
        this.enrollmentDate = Instant.now();
        this.status = "enrolled";
        this.paymentStatus = "paid";
    }

    // ==================== GETTERS & SETTERS ====================
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getCourseId() { return courseId; }
    public void setCourseId(String courseId) { this.courseId = courseId; }

    public Instant getEnrollmentDate() { return enrollmentDate; }
    public void setEnrollmentDate(Instant enrollmentDate) { this.enrollmentDate = enrollmentDate; }

    public long getCreatedAt() { return createdAt; }
    public void setCreatedAt(long createdAt) { this.createdAt = createdAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public double getAmountPaid() { return amountPaid; }
    public void setAmountPaid(double amountPaid) { this.amountPaid = amountPaid; }

    public String getPaymentId() { return paymentId; }
    public void setPaymentId(String paymentId) { this.paymentId = paymentId; }
}