package app.dto;

public class LessonDTO {
    private String id;
    private String moduleId;
    private String title;
    private String description;
    private String videoUrl;
    private String notesPdfUrl;
    private int duration;
    private boolean isPreviewFree;
    private int orderNo;
    private boolean completed;
    private long completedAt;

    public LessonDTO() {
    }

    public LessonDTO(String id, String moduleId, String title, String description, int duration, int orderNo) {
        this.id = id;
        this.moduleId = moduleId;
        this.title = title;
        this.description = description;
        this.duration = duration;
        this.orderNo = orderNo;
        this.isPreviewFree = false;
        this.completed = false;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getModuleId() {
        return moduleId;
    }

    public void setModuleId(String moduleId) {
        this.moduleId = moduleId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }

    public String getNotesPdfUrl() {
        return notesPdfUrl;
    }

    public void setNotesPdfUrl(String notesPdfUrl) {
        this.notesPdfUrl = notesPdfUrl;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public boolean isPreviewFree() {
        return isPreviewFree;
    }

    public void setPreviewFree(boolean previewFree) {
        isPreviewFree = previewFree;
    }

    public int getOrderNo() {
        return orderNo;
    }

    public void setOrderNo(int orderNo) {
        this.orderNo = orderNo;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public long getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(long completedAt) {
        this.completedAt = completedAt;
    }
}
