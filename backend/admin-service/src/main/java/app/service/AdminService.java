package app.service;

import java.util.Map;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import app.client.CourseServiceClient;
import app.client.EnrollmentServiceClient;
import app.client.UserServiceClient;
import app.dto.CategorizedUsersDTO;
import app.dto.DashboardDTO;
import app.dto.TeacherApprovalDTO;
import app.dto.UserDTO;
import app.model.User;

@Service
public class AdminService {

    private static final Logger logger = LoggerFactory.getLogger(AdminService.class);

    @Autowired
    private UserServiceClient userClient;

    @Autowired
    private CourseServiceClient courseClient;

    @Autowired
    private EnrollmentServiceClient enrollmentClient;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private SupportService supportService;

    // ================== DASHBOARD ==================
    public DashboardDTO getDashboardData() {

        // Use null-safe checks to prevent 500 errors if a downstream service is down
        List<?> users = null;
        List<?> courses = null;
        List<?> enrollments = null;
        
        try {
         users = userClient.getAllUsersAdmin();
        } catch (Exception e) {
            logger.error("Failed to fetch users for dashboard: {}", e.getMessage());
        }

        try {
            courses = courseClient.getAllCourses();
        } catch (Exception e) {
            logger.error("Failed to fetch courses for dashboard: {}", e.getMessage());
        }

        try {
            enrollments = enrollmentClient.getAllEnrollments();
        } catch (Exception e) {
            logger.error("Failed to fetch enrollments for dashboard: {}", e.getMessage());
        }

        int totalUsers = (users != null) ? users.size() : 0;
        int totalCourses = (courses != null) ? courses.size() : 0;
        int totalEnrollments = (enrollments != null) ? enrollments.size() : 0;

        // Fetch Revenue from PaymentService
        double revenue = 0.0;
        try {
            Map<String, Object> paymentSummary = paymentService.getSummary();
            if (paymentSummary != null && paymentSummary.get("totalRevenue") != null) {
                revenue = ((Number) paymentSummary.get("totalRevenue")).doubleValue();
            }
        } catch (Exception e) {
            logger.error("Failed to fetch revenue for dashboard: {}", e.getMessage());
            revenue = 0.0;
        }

        // Fetch Open Tickets from SupportService
        int openTickets = 0;
        try {
            List<Map<String, Object>> tickets = supportService.getUserTickets(null);
            if (tickets != null) {
                openTickets = (int) tickets.stream()
                    .filter(t -> t != null && "open".equals(t.get("status")))
                    .count();
            }
        } catch (Exception e) {
            logger.error("Failed to fetch support tickets for dashboard: {}", e.getMessage());
            openTickets = 0;
        }

        return new DashboardDTO(totalUsers, totalCourses, totalEnrollments, revenue, openTickets);
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

    // ================== APPROVE TEACHER WITH PASSWORD ==================
    public void approveTeacherWithPassword(String requestId, TeacherApprovalDTO approvalData) throws Exception {
        userClient.approveTeacherWithPassword(requestId, approvalData);
    }

    // ================== GET ALL STUDENTS ==================
    public List<UserDTO> getAllStudents() {
        List<UserDTO> allUsers = userClient.getAllUsersAdmin();
        if (allUsers == null) {
            return List.of();
        }
        return allUsers.stream()
                .filter(user -> User.ROLE_STUDENT.equals(user.getRole()))
                .collect(Collectors.toList());
    }

    // ================== GET ALL TEACHERS ==================
    public List<UserDTO> getAllTeachers() {
        List<UserDTO> allUsers = userClient.getAllUsersAdmin();
        if (allUsers == null) {
            return List.of();
        }
        return allUsers.stream()
                .filter(user -> User.ROLE_TEACHER.equals(user.getRole()))
                .collect(Collectors.toList());
    }

    // ================== GET ALL BLOCKED USERS ==================
    public List<UserDTO> getAllBlockedUsers() {
        List<UserDTO> allUsers = userClient.getAllUsersAdmin();
        if (allUsers == null) {
            return List.of();
        }
        return allUsers.stream()
                .filter(user -> User.STATUS_BLOCKED.equals(user.getStatus()))
                .collect(Collectors.toList());
    }

    // ================== GET CATEGORIZED USERS ==================
    public CategorizedUsersDTO getCategorizedUsers() {
        List<UserDTO> allUsers = userClient.getAllUsersAdmin();
        
        if (allUsers == null) {
            allUsers = List.of();
        }

        // Separate by role
        List<UserDTO> students = allUsers.stream()
                .filter(user -> User.ROLE_STUDENT.equals(user.getRole()))
                .collect(Collectors.toList());

        List<UserDTO> teachers = allUsers.stream()
                .filter(user -> User.ROLE_TEACHER.equals(user.getRole()))
                .collect(Collectors.toList());

        // Separate blocked users
        List<UserDTO> blockedUsers = allUsers.stream()
                .filter(user -> User.STATUS_BLOCKED.equals(user.getStatus()))
                .collect(Collectors.toList());

        // Count active users
        List<UserDTO> activeUsers = allUsers.stream()
                .filter(user -> User.STATUS_ACTIVE.equals(user.getStatus()))
                .collect(Collectors.toList());

        return new CategorizedUsersDTO(
                students,
                teachers,
                blockedUsers,
                students.size(),
                teachers.size(),
                blockedUsers.size(),
                activeUsers.size()
        );
    }

    // ================== GET STUDENTS BY STATUS ==================
    public List<UserDTO> getStudentsByStatus(String status) {
        List<UserDTO> allUsers = userClient.getAllUsersAdmin();
        if (allUsers == null) {
            return List.of();
        }
        return allUsers.stream()
                .filter(user -> User.ROLE_STUDENT.equals(user.getRole()) &&
                        status.equals(user.getStatus()))
                .collect(Collectors.toList());
    }

    // ================== GET TEACHERS BY STATUS ==================
    public List<UserDTO> getTeachersByStatus(String status) {
        List<UserDTO> allUsers = userClient.getAllUsersAdmin();
        if (allUsers == null) {
            return List.of();
        }
        return allUsers.stream()
                .filter(user -> User.ROLE_TEACHER.equals(user.getRole()) &&
                        status.equals(user.getStatus()))
                .collect(Collectors.toList());
    }
}