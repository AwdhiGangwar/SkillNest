package app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import app.dto.DashboardDTO;
import app.model.User;
import app.service.AdminService;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

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
    
}