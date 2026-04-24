package app.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Lesson {

    private String id;
    private String moduleId;
    private String title;
    private String description;
    private String videoUrl;
    private String notesPdfUrl;
    private int duration; // in minutes
    private boolean isPreviewFree;
    private int orderNo;
    private long createdAt;
    private long updatedAt;
    private String type;      // VIDEO or PDF
private String courseId;  // ✅ Add karo

    public Lesson() {
        this.createdAt = System.currentTimeMillis();
        this.updatedAt = System.currentTimeMillis();
        this.isPreviewFree = false;
        this.duration = 0;
    }

    public Lesson(String id, String moduleId, String title, String description, int duration, int orderNo) {
        this.id = id;
        this.moduleId = moduleId;
        this.title = title;
        this.description = description;
        this.duration = duration;
        this.orderNo = orderNo;
        this.isPreviewFree = false;
        this.createdAt = System.currentTimeMillis();
        this.updatedAt = System.currentTimeMillis();
    }

    // Getters
    public String getId() {
        return id;
    }

    public String getModuleId() {
        return moduleId;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getVideoUrl() {
        return videoUrl;
    }

    public String getNotesPdfUrl() {
        return notesPdfUrl;
    }

    public int getDuration() {
        return duration;
    }

    public boolean isPreviewFree() {
        return isPreviewFree;
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

    public void setModuleId(String moduleId) {
        this.moduleId = moduleId;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }

    public void setNotesPdfUrl(String notesPdfUrl) {
        this.notesPdfUrl = notesPdfUrl;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public void setPreviewFree(boolean previewFree) {
        isPreviewFree = previewFree;
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
    public String getType() { return type; }
public void setType(String type) { this.type = type; }

public String getCourseId() { return courseId; }
public void setCourseId(String courseId) { this.courseId = courseId; }
}
