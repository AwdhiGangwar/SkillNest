package app.model;

public class Availability {

    private String id;
    private String teacherId;
    private String date;       // "2026-04-01"
    private String startTime;  // "10:00"
    private String endTime;    // "11:00"
    private String status;     // available / booked

    public Availability() {}

    // getters & setters

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTeacherId() { return teacherId; }
    public void setTeacherId(String teacherId) { this.teacherId = teacherId; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}