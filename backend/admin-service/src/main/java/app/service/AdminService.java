package app.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import app.client.CourseServiceClient;
import app.client.EnrollmentServiceClient;
import app.client.UserServiceClient;
import app.dto.DashboardDTO;
import app.model.User;

@Service
public class AdminService {

    @Autowired
    private UserServiceClient userClient;

    @Autowired
    private CourseServiceClient courseClient;

    @Autowired
    private EnrollmentServiceClient enrollmentClient;

    // ================== DASHBOARD ==================
    public DashboardDTO getDashboardData() {

        List<?> users = userClient.getAllUsers();
        List<?> courses = courseClient.getAllCourses();
        List<?> enrollments = enrollmentClient.getAllEnrollments();

        int totalUsers = (users != null) ? users.size() : 0;
        int totalCourses = (courses != null) ? courses.size() : 0;
        int totalEnrollments = (enrollments != null) ? enrollments.size() : 0;

        return new DashboardDTO(
                totalUsers,
                totalCourses,
                totalEnrollments
        );
    }

    // ================== APPROVE TEACHER ==================
    public void approveTeacher(String userId) {
        userClient.approveTeacher(userId);
    }

    // ================== BLOCK USER ==================
    public void blockUser(String userId) {
        userClient.blockUser(userId);
    }
    public List<?> getAllUsers() {
        return userClient.getAllUsersAdmin();
    }
 // ================== UNBLOCK USER ==================
    public void unblockUser(String userId) {
        userClient.unblockUser(userId);
    }
    // ================== Accoutn creating of  USER ==================
    public void createTeacher(User user) throws Exception {
        userClient.createTeacher(user);
    }
}