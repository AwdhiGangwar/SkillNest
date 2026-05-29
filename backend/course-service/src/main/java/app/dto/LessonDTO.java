package app.dto;

public class LessonDTO {
    private String id;
    private String moduleId;
    private String title;
    private String description;
    
    private String videoUrl;           // External link
    private String videoFileUrl;       // Uploaded video URL
    private String videoFileName;
    private Long videoFileSize;
    private String videoContentType;

    private String notesPdfUrl;
    private int duration;
    private boolean isPreviewFree;
    private int orderNo;
    private boolean completed;
    private long completedAt;

    // Constructors, Getters and Setters
    public LessonDTO() {}

    // Getters & Setters (sab add kar do)
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

    // Baaki getters & setters same rakh sakte ho...
}