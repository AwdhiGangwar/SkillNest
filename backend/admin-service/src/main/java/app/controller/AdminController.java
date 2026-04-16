package app.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.servlet.http.HttpServletRequest;

import app.dto.DashboardDTO;
import app.dto.TeacherApprovalDTO;
import app.dto.CategorizedUsersDTO;
import app.dto.UserDTO;
import app.model.User;
import app.service.AdminService;
import app.service.AnalyticsService;
import app.service.PaymentService;
import app.service.SupportService;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private AnalyticsService analyticsService;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private SupportService supportService;

    @GetMapping("/dashboard")
    public DashboardDTO getDashboard() {
        return adminService.getDashboardData();
    }

    @PutMapping("/teacher/{id}/approve")
    public String approveTeacher(@PathVariable String id) {
        adminService.approveTeacher(id);
        return "Teacher Approved";
    }

    @PutMapping("/user/{id}/block")
    public String blockUser(@PathVariable String id) {
        adminService.blockUser(id);
        return "User Blocked";
    }
    @GetMapping("/users")
    public List<?> getAllUsers() {
        return adminService.getAllUsers();
    }
    @PutMapping("/user/{id}/unblock")
    public String unblockUser(@PathVariable String id) {
        adminService.unblockUser(id);
        return "User Unblocked";
    }

    // =============== NEW: CATEGORIZED USER ENDPOINTS ===============

    @GetMapping("/users/students")
    public ResponseEntity<List<UserDTO>> getAllStudents() {
        try {
            List<UserDTO> students = adminService.getAllStudents();
            return ResponseEntity.ok(students);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/users/teachers")
    public ResponseEntity<List<UserDTO>> getAllTeachers() {
        try {
            List<UserDTO> teachers = adminService.getAllTeachers();
            return ResponseEntity.ok(teachers);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/users/blocked")
    public ResponseEntity<List<UserDTO>> getAllBlockedUsers() {
        try {
            List<UserDTO> blockedUsers = adminService.getAllBlockedUsers();
            return ResponseEntity.ok(blockedUsers);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/users/categorized")
    public ResponseEntity<CategorizedUsersDTO> getCategorizedUsers() {
        try {
            CategorizedUsersDTO categorizedUsers = adminService.getCategorizedUsers();
            return ResponseEntity.ok(categorizedUsers);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/users/students/{status}")
    public ResponseEntity<List<UserDTO>> getStudentsByStatus(@PathVariable String status) {
        try {
            // Validate status
            if (!status.equals("active") && !status.equals("blocked")) {
                return ResponseEntity.badRequest().build();
            }
            List<UserDTO> students = adminService.getStudentsByStatus(status);
            return ResponseEntity.ok(students);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/users/teachers/{status}")
    public ResponseEntity<List<UserDTO>> getTeachersByStatus(@PathVariable String status) {
        try {
            // Validate status
            if (!status.equals("active") && !status.equals("blocked")) {
                return ResponseEntity.badRequest().build();
            }
            List<UserDTO> teachers = adminService.getTeachersByStatus(status);
            return ResponseEntity.ok(teachers);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
 // 🔥 NEW FEATURE: CREATE TEACHER ACCOUNT
    @PostMapping("/create-teacher")
    public ResponseEntity<?> createTeacher(@RequestBody User user) {
        try {
            // ✅ Validate user input
            if (user == null) {
                return ResponseEntity.badRequest()
                        .body("User data is required");
            }
            
            if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body("Email is required to create a teacher account");
            }
            
            if (user.getName() == null || user.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body("Teacher name is required");
            }

            // Force role to teacher
            user.setRole("teacher");

            // Create teacher via admin service
            adminService.createTeacher(user);

            return ResponseEntity.ok("Teacher account created successfully! Invitation link sent to " + user.getEmail());

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
            
        } catch (Exception e) {
            System.err.println("Error creating teacher: " + e.getMessage());
            e.printStackTrace();
            
            String errorMsg = e.getMessage() != null ? e.getMessage() : "Failed to create teacher account";
            return ResponseEntity.internalServerError().body(errorMsg);
        }
    }

    // 🔥 NEW: APPROVE TEACHER REQUEST WITH PASSWORD
    @PostMapping("/teacher-requests/{id}/approve")
    public ResponseEntity<?> approveTeacherRequest(@PathVariable String id, 
                                                   @RequestBody TeacherApprovalDTO approvalData) {
        try {
            if (approvalData == null || approvalData.getPassword() == null || approvalData.getPassword().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body("Password is required");
            }

            if (approvalData.getPassword().length() < 8) {
                return ResponseEntity.badRequest()
                        .body("Password must be at least 8 characters long");
            }

            // Approve request and create teacher with password
            adminService.approveTeacherWithPassword(id, approvalData);

            return ResponseEntity.ok("Teacher account created and approved successfully!");

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            System.err.println("Error approving teacher: " + e.getMessage());
            e.printStackTrace();
            String errorMsg = e.getMessage() != null ? e.getMessage() : "Failed to approve teacher";
            return ResponseEntity.internalServerError().body(errorMsg);
        }
    }

    // ======================= ANALYTICS =======================
    @GetMapping("/analytics")
    public ResponseEntity<?> getAnalytics(HttpServletRequest request) {
        try {
            String uid = (String) request.getAttribute("uid");
            if (uid == null) uid = "";
            
            Map<String, Object> analytics = analyticsService.getUserAnalytics(uid);
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to fetch analytics");
        }
    }

    // ======================= PAYMENTS =======================
    @GetMapping("/payments")
    public ResponseEntity<?> getPayments(HttpServletRequest request) {
        try {
            String uid = (String) request.getAttribute("uid");
            if (uid == null) uid = "";
            
            // If called by admin (no uid) return all transactions, otherwise user-specific
            if (uid.isEmpty()) {
                List<Map<String, Object>> transactions = paymentService.getAllTransactions();
                return ResponseEntity.ok(transactions);
            } else {
                List<Map<String, Object>> transactions = paymentService.getUserTransactions(uid);
                return ResponseEntity.ok(transactions);
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to fetch payments");
        }
    }

    @GetMapping("/payments/summary")
    public ResponseEntity<?> getPaymentsSummary(HttpServletRequest request) {
        try {
            Map<String, Object> summary = paymentService.getSummary();
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to fetch payment summary");
        }
    }

    @GetMapping("/payments/teacher-payouts")
    public ResponseEntity<?> getTeacherPayouts(HttpServletRequest request) {
        try {
            List<Map<String, Object>> payouts = paymentService.getTeacherPayouts();
            return ResponseEntity.ok(payouts);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to fetch teacher payouts");
        }
    }

    @PostMapping("/payments/process")
    public ResponseEntity<?> processPayment(@RequestBody Map<String, Object> paymentData,
                                           HttpServletRequest request) {
        try {
            String uid = (String) request.getAttribute("uid");
            double amount = ((Number) paymentData.get("amount")).doubleValue();
            String courseId = (String) paymentData.get("courseId");
            
            Map<String, Object> result = paymentService.processPayment(uid, amount, courseId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to process payment");
        }
    }

    // ======================= SUPPORT =======================
    @GetMapping("/support/tickets")
    public ResponseEntity<?> getSupportTickets(HttpServletRequest request) {
        try {
            String uid = (String) request.getAttribute("uid");
            if (uid == null) uid = "";
            
            List<Map<String, Object>> tickets = supportService.getUserTickets(uid);
            return ResponseEntity.ok(tickets);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to fetch support tickets");
        }
    }

    @PostMapping("/support/tickets")
    public ResponseEntity<?> createSupportTicket(@RequestBody Map<String, String> ticketData,
                                                HttpServletRequest request) {
        try {
            String uid = (String) request.getAttribute("uid");
            if (uid == null) uid = "";
            
            if (ticketData.get("subject") == null || ticketData.get("message") == null) {
                return ResponseEntity.badRequest().body("Subject and message are required");
            }
            
            Map<String, Object> ticket = supportService.createTicket(uid, ticketData);
            return ResponseEntity.ok(ticket);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to create support ticket");
        }
    }

    @PutMapping("/support/tickets/{id}")
    public ResponseEntity<?> updateSupportTicket(@PathVariable String id,
                                                 @RequestBody Map<String, Object> updates,
                                                 HttpServletRequest request) {
        try {
            Map<String, Object> ticket = supportService.updateTicket(id, updates);
            return ResponseEntity.ok(ticket);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to update support ticket");
        }
    }
    
    @PostMapping("/support/tickets/sync")
    public ResponseEntity<?> syncSupportTicket(@RequestBody Map<String, Object> ticketData) {
        try {
            Map<String, Object> ticket = supportService.syncTicket(ticketData);
            return ResponseEntity.ok(ticket);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to sync support ticket");
        }
    }
    
    @GetMapping("/support/health")
    public ResponseEntity<?> getSupportHealth() {
        try {
            Map<String, Object> health = supportService.getSupportHealth();
            return ResponseEntity.ok(health);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to fetch support health");
        }
    }
    
    @DeleteMapping("/support/tickets/{id}")
    public ResponseEntity<?> deleteSupportTicket(@PathVariable String id) {
        try {
            Map<String, Object> result = supportService.deleteTicket(id);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to delete support ticket");
        }
    }
    
}