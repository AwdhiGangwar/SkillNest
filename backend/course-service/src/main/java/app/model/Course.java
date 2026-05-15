package app.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Course {

    private String id;
    private String title;
    private String description;
    private String category;
    private double price;
    private int maxStudents;
    private String teacherId;
    private List<String> teacherIds = new ArrayList<>();
    private String teacherName;
    private int totalClasses;
    private String modules;
    private String level;
    private int duration;
    private long createdAt;
    private long updatedAt;

    public Course() {
        this.createdAt = System.currentTimeMillis();
        this.updatedAt = System.currentTimeMillis();
    }

    public Course(String id, String title, String description, double price, String teacherId) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.teacherId = teacherId;
        if (teacherId != null) this.teacherIds.add(teacherId);
        this.createdAt = System.currentTimeMillis();
        this.updatedAt = System.currentTimeMillis();
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

    public String getCategory() {
        return category;
    }

    public double getPrice() {
        return price;
    }

    public int getMaxStudents() {
        return maxStudents;
    }

    public List<String> getTeacherIds() {
        return teacherIds;
    }

    public String getTeacherId() {
        return teacherId;
    }

    public long getCreatedAt() {
        return createdAt;
    }

    public long getUpdatedAt() {
        return updatedAt;
    }

    public String getTeacherName() {
        return teacherName;
    }

    public int getTotalClasses() {
        return totalClasses;
    }

    public String getModules() {
        return modules;
    }

    public String getLevel() {
        return level;
    }

    public int getDuration() {
        return duration;
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

    public void setCategory(String category) {
        this.category = category;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public void setMaxStudents(int maxStudents) {
        this.maxStudents = maxStudents;
    }

    public void setTeacherId(String teacherId) {
        this.teacherId = teacherId;
    }

    public void setTeacherIds(List<String> teacherIds) {
        this.teacherIds = teacherIds;
    }

    public void setCreatedAt(long createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(long updatedAt) {
        this.updatedAt = updatedAt;
    }

    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }

    public void setTotalClasses(int totalClasses) {
        this.totalClasses = totalClasses;
    }

    public void setModules(String modules) {
        this.modules = modules;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }
}