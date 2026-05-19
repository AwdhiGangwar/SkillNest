package app.controller;

import app.dto.UserDTO;
import app.model.TeacherRequest;
import app.model.User;
import app.service.AdminService;
import app.service.TeacherRequestService;
import app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private UserService userService;

    @Autowired
    private TeacherRequestService teacherRequestService;

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

    // 🔥 CREATE TEACHER ACCOUNT
    @PostMapping("/create-teacher")
    public ResponseEntity<?> createTeacher(@RequestBody User user) {
        try {
            if (user == null) {
                return ResponseEntity.badRequest().body("User data is required");
            }
            if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email is required");
            }
            if (user.getName() == null || user.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Teacher name is required");
            }

            user.setRole("teacher");
            User createdTeacher = userService.createTeacherWithAuth(user);

            return ResponseEntity.ok("Teacher account created successfully! Invitation link sent to " + createdTeacher.getEmail());

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage() != null ? e.getMessage() : "Failed to create teacher");
        }
    }

    // 🔥 APPROVE TEACHER REQUEST WITH PASSWORD
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

            User teacher = new User();
            teacher.setName(name);
            teacher.setEmail(email);
            teacher.setRole("teacher");

            // Copy extra details from teacher request if available
            try {
                TeacherRequest req = teacherRequestService.getRequestById(requestId);
                if (req != null) {
                    if (req.getSkills() != null) teacher.setSkills(req.getSkills());
                    if (req.getExperience() != null) teacher.setExperience(req.getExperience());
                    if (req.getBio() != null) teacher.setBio(req.getBio());
                }
            } catch (Exception e) {
                System.err.println("Warning: Could not fetch teacher request: " + e.getMessage());
            }

            User createdTeacher = userService.createTeacherWithPassword(teacher, password);

            // Mark request as approved
            try {
                adminService.approveRequest(requestId);
            } catch (Exception e) {
                System.err.println("Warning: Could not update request status: " + e.getMessage());
            }

            return ResponseEntity.ok("Teacher account created and approved successfully!");

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage() != null ? e.getMessage() : "Failed to approve teacher");
        }
    }

    // 🔥 GET ALL USERS FOR ADMIN
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        try {
            List<UserDTO> users = userService.getAllUsersAsDTO();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // 🔥 BLOCK USER
    @PutMapping("/user/{id}/block")
    public ResponseEntity<String> blockUser(@PathVariable String id) {
        try {
            userService.blockUser(id);
            return ResponseEntity.ok("User blocked successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to block user");
        }
    }

    // 🔥 UNBLOCK USER
    @PutMapping("/user/{id}/unblock")
    public ResponseEntity<String> unblockUser(@PathVariable String id) {
        try {
            userService.unblockUser(id);
            return ResponseEntity.ok("User unblocked successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to unblock user");
        }
    }
}