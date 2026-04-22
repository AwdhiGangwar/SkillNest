package app.dto;

public class DashboardDTO {

    private int totalUsers;
    private int totalCourses;
    private int totalEnrollments;
    private double totalRevenue;
    private int openSupportTickets;

    public DashboardDTO() {
    }

    public DashboardDTO(int totalUsers, int totalCourses, int totalEnrollments, double totalRevenue, int openSupportTickets) {
        this.totalUsers = totalUsers;
        this.totalCourses = totalCourses;
        this.totalEnrollments = totalEnrollments;
        this.totalRevenue = totalRevenue;
        this.openSupportTickets = openSupportTickets;
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

    public double getTotalRevenue() {
        return totalRevenue;
    }

    public int getOpenSupportTickets() {
        return openSupportTickets;
    }

    public void setTotalUsers(int totalUsers) {
        this.totalUsers = totalUsers;
    }

    public void setTotalCourses(int totalCourses) {
        this.totalCourses = totalCourses;
    }

    public void setTotalEnrollments(int totalEnrollments) {
        this.totalEnrollments = totalEnrollments;
    }

    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public void setOpenSupportTickets(int openSupportTickets) {
        this.openSupportTickets = openSupportTickets;
    }
}