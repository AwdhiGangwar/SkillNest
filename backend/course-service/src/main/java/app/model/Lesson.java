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

    // Option 1: External Video URL (YouTube etc.)
    private String videoUrl;

    // Option 2: Uploaded Video from Local
    private String videoFileUrl;      // Firebase Storage ka public URL
    private String videoFileName;
    private Long videoFileSize;
    private String videoContentType;

    private String notesPdfUrl;
    private int duration; // in minutes
    private boolean isPreviewFree;
    private int orderNo;
    private long createdAt;
    private long updatedAt;
    private String type;       // VIDEO or PDF
    private String courseId;

    public Lesson() {
        this.createdAt = System.currentTimeMillis();
        this.updatedAt = System.currentTimeMillis();
        this.isPreviewFree = false;
        this.duration = 0;
    }

    // Getters & Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getModuleId() { return moduleId; }
    public void setModuleId(String moduleId) { this.moduleId = moduleId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }

    public String getVideoFileUrl() { return videoFileUrl; }
    public void setVideoFileUrl(String videoFileUrl) { this.videoFileUrl = videoFileUrl; }

    public String getVideoFileName() { return videoFileName; }
    public void setVideoFileName(String videoFileName) { this.videoFileName = videoFileName; }

    public Long getVideoFileSize() { return videoFileSize; }
    public void setVideoFileSize(Long videoFileSize) { this.videoFileSize = videoFileSize; }

    public String getVideoContentType() { return videoContentType; }
    public void setVideoContentType(String videoContentType) { this.videoContentType = videoContentType; }

    public String getNotesPdfUrl() { return notesPdfUrl; }
    public void setNotesPdfUrl(String notesPdfUrl) { this.notesPdfUrl = notesPdfUrl; }

    public int getDuration() { return duration; }
    public void setDuration(int duration) { this.duration = duration; }

    public boolean isPreviewFree() { return isPreviewFree; }
    public void setPreviewFree(boolean previewFree) { isPreviewFree = previewFree; }

    public int getOrderNo() { return orderNo; }
    public void setOrderNo(int orderNo) { this.orderNo = orderNo; }

    public long getCreatedAt() { return createdAt; }
    public void setCreatedAt(long createdAt) { this.createdAt = createdAt; }

    public long getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(long updatedAt) { this.updatedAt = updatedAt; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getCourseId() { return courseId; }
    public void setCourseId(String courseId) { this.courseId = courseId; }
}