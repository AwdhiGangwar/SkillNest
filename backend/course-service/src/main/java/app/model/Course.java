package app.model;

public class Course {

    private String id;
    private String title;
    private String description;
    private double price;
    private String teacherId;
    private long createdAt;

    public Course() {
        this.createdAt = System.currentTimeMillis();
    }

    public Course(String id, String title, String description, double price, String teacherId) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.teacherId = teacherId;
        this.createdAt = System.currentTimeMillis();
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
}