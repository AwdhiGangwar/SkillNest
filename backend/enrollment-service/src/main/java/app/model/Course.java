package app.model;

<<<<<<< HEAD
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.Instant;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Course {

    private String id;
    private String teacherId;
    private String teacherName;    // Added: cached teacher name
    private String title;
    private String description;
    private double price;
    private int maxStudents = 30;
    private String status = "active";
    private String imageUrl;
    private String category;
    private int duration;           // in hours
    private String level;           // beginner, intermediate, advanced
    private int totalClasses;       // Added: total number of classes
    private String modules;         // Added: comma-separated or JSON list of modules
    private long createdAt;
    private long updatedAt;

    public Course() {
        this.createdAt = System.currentTimeMillis();
        this.updatedAt = System.currentTimeMillis();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTeacherId() { return teacherId; }
    public void setTeacherId(String teacherId) { this.teacherId = teacherId; }

    public String getTeacherName() { return teacherName; }
    public void setTeacherName(String teacherName) { this.teacherName = teacherName; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public int getMaxStudents() { return maxStudents; }
    public void setMaxStudents(int maxStudents) { this.maxStudents = maxStudents; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public int getDuration() { return duration; }
    public void setDuration(int duration) { this.duration = duration; }

    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }

    public int getTotalClasses() { return totalClasses; }
    public void setTotalClasses(int totalClasses) { this.totalClasses = totalClasses; }

    public String getModules() { return modules; }
    public void setModules(String modules) { this.modules = modules; }

    public long getCreatedAt() { return createdAt; }
    public void setCreatedAt(long createdAt) { this.createdAt = createdAt; }

    public long getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(long updatedAt) { this.updatedAt = updatedAt; }
=======
public class Course {

    private String id;
    private String title;
    private String description;
    private double price;
    private String teacherId;
    private long createdAt;

    public Course() {}

    public Course(String id, String title, String description, double price, String teacherId, long createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.teacherId = teacherId;
        this.createdAt = createdAt;
    }

    // GETTERS

    public String getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public double getPrice() {
        return price;
    }

    public String getTeacherId() {
        return teacherId;
    }

    public long getCreatedAt() {
        return createdAt;
    }

    // SETTERS

    public void setId(String id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public void setTeacherId(String teacherId) {
        this.teacherId = teacherId;
    }

    public void setCreatedAt(long createdAt) {
        this.createdAt = createdAt;
    }
>>>>>>> ca9e6a8546d45fdcb2d8dbf6b42011e2c1e874cb
}