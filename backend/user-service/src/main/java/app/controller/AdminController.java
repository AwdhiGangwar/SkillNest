package app.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import app.model.TeacherRequest;
import app.model.User;
import app.service.AdminService;
import app.service.UserService;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private UserService userService;

    // 🔹 Get all teacher requests
    @GetMapping("/teacher-requests")
    public List<TeacherRequest> getRequests() throws Exception {
        return adminService.getAllRequests();
    }

    // 🔹 Approve teacher request
    @PutMapping("/approve/{id}")
    public String approve(@PathVariable String id) throws Exception {
        adminService.approveRequest(id);
        return "Approved";
    }

    // 🔹 Reject teacher request
    @PutMapping("/reject/{id}")
    public String reject(@PathVariable String id) throws Exception {
        adminService.rejectRequest(id);
        return "Rejected";
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

            // Create teacher with authentication and email invitation
            User createdTeacher = userService.createTeacherWithAuth(user);

            // ✅ Return the created teacher with success message
            return ResponseEntity.ok()
                    .body("Teacher account created successfully! Invitation link sent to " + createdTeacher.getEmail());

        } catch (IllegalArgumentException e) {
            // Input validation errors from service
            return ResponseEntity.badRequest().body(e.getMessage());
            
        } catch (Exception e) {
            System.err.println("Error creating teacher: " + e.getMessage());
            e.printStackTrace();
            
            // Return meaningful error message
            String errorMsg = e.getMessage() != null ? e.getMessage() : "Failed to create teacher account";
            return ResponseEntity.internalServerError().body(errorMsg);
        }
    }

    // 🔥 NEW: APPROVE TEACHER REQUEST WITH PASSWORD (from teacher-requests page)
    @PostMapping("/approve-teacher/{requestId}")
    public ResponseEntity<?> approveTeacherWithPassword(@PathVariable String requestId,
                                                        @RequestBody Map<String, String> approvalData) {
        try {
            String name = approvalData.get("name");
            String email = approvalData.get("email");
            String password = approvalData.get("password");

            if (password == null || password.isEmpty()) {
                return ResponseEntity.badRequest().body("Password is required");
            }

            if (password.length() < 8) {
                return ResponseEntity.badRequest().body("Password must be at least 8 characters");
            }

            // Create teacher with Firebase auth using email and password
            User teacher = new User();
            teacher.setName(name);
            teacher.setEmail(email);
            teacher.setRole("teacher");

            User createdTeacher = userService.createTeacherWithPassword(teacher, password);

            // Mark teacher request as approved
            try {
                adminService.approveRequest(requestId);
            } catch (Exception e) {
                System.err.println("Warning: Could not mark teacher request as approved: " + e.getMessage());
            }

            return ResponseEntity.ok("Teacher account created and approved successfully!");

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            System.err.println("Error approving teacher with password: " + e.getMessage());
            e.printStackTrace();
            String errorMsg = e.getMessage() != null ? e.getMessage() : "Failed to approve teacher";
            return ResponseEntity.internalServerError().body(errorMsg);
        }
    }
}