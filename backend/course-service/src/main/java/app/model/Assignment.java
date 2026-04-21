package app.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Assignment {

    private String id;
    private String lessonId;
    private String title;
    private String description;
    private String attachmentUrl;
    private long dueDate;
    private int orderNo;
    private long createdAt;
    private long updatedAt;

    public Assignment() {
        this.createdAt = System.currentTimeMillis();
        this.updatedAt = System.currentTimeMillis();
    }

    public Assignment(String id, String lessonId, String title, String description) {
        this.id = id;
        this.lessonId = lessonId;
        this.title = title;
        this.description = description;
        this.createdAt = System.currentTimeMillis();
        this.updatedAt = System.currentTimeMillis();
    }

    // Getters
    public String getId() {
        return id;
    }

    public String getLessonId() {
        return lessonId;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getAttachmentUrl() {
        return attachmentUrl;
    }

    public long getDueDate() {
        return dueDate;
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

    public void setLessonId(String lessonId) {
        this.lessonId = lessonId;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setAttachmentUrl(String attachmentUrl) {
        this.attachmentUrl = attachmentUrl;
    }

    public void setDueDate(long dueDate) {
        this.dueDate = dueDate;
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
}
