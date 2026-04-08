package app.dto;

public class DashboardDTO {

    private int totalUsers;
    private int totalCourses;
    private int totalEnrollments;

    public DashboardDTO(int totalUsers, int totalCourses, int totalEnrollments) {
        this.totalUsers = totalUsers;
        this.totalCourses = totalCourses;
        this.totalEnrollments = totalEnrollments;
    }

    public int getTotalUsers() {
        return totalUsers;
    }

    public int getTotalCourses() {
        return totalCourses;
    }

    public int getTotalEnrollments() {
        return totalEnrollments;
    }
}