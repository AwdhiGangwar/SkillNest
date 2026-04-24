package app.controller;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import app.model.User;
import app.service.UserService;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/health")
    public String health() {
        return "User Service is running 🚀";
    }

    @PostMapping("/users")
    public String createUser(@RequestBody User user, HttpServletRequest request) throws Exception {

        // Ensure caller is authenticated and use verified UID from token
        String uid = (String) request.getAttribute("uid");
        if (uid == null) {
            // If no UID available, reject the request to avoid trusting client-provided id
            throw new RuntimeException("Unauthorized: UID missing");
        }

        // Use server-verified UID to prevent mismatches
        user.setId(uid);

        // Allow both students and teachers to register
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("student"); // Default to student if no role specified
        }

        return userService.createUser(user);
    }
    @GetMapping("/me")
    public User getCurrentUser(HttpServletRequest request) throws Exception {

    	String uid = (String) request.getAttribute("uid");
    	String email = (String) request.getAttribute("email");
    	String name = (String) request.getAttribute("name");

        if (uid == null) {
            throw new RuntimeException("Unauthorized: UID missing");
        }

        return userService.getOrCreateUser(uid, email, name);
    }
    @GetMapping("/users")
    public List<User> getAllUsers() throws Exception {
        return userService.getAllUsers();
    }
 // ================== ADMIN: GET ALL USERS ==================
    @GetMapping("/admin/users")
    public List<User> getAllUsersAdmin() throws Exception {
        return userService.getAllUsers();
    }

    // ================== ADMIN: BLOCK USER ==================
    @PutMapping("/admin/user/{id}/block")
    public String blockUser(@PathVariable String id) throws Exception {
        userService.blockUser(id);
        return "User blocked successfully";
    }
    // ================== ADMIN: UNBLOCK USER ==================
    @PutMapping("/admin/user/{id}/unblock")
    public String unblockUser(@PathVariable String id) throws Exception {
        userService.unblockUser(id);
        return "User unblocked successfully";
    }

    // ================== UPDATE USER PROFILE ==================
    @PutMapping("/users/profile")
    public ResponseEntity<?> updateProfile(@RequestBody User profileData, 
                                          HttpServletRequest request) {
        try {
            String uid = (String) request.getAttribute("uid");
            if (uid == null) {
                return ResponseEntity.status(401).body("Unauthorized: UID missing");
            }

            User updatedUser = userService.updateUserProfile(uid, profileData);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Failed to update profile: " + e.getMessage());
        }
    }

    // ================== CHANGE PASSWORD ==================
    @PostMapping("/users/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> passwordData,
                                           HttpServletRequest request) {
        try {
            String uid = (String) request.getAttribute("uid");
            if (uid == null) {
                return ResponseEntity.status(401).body("Unauthorized: UID missing");
            }

            String oldPassword = passwordData.get("oldPassword");
            String newPassword = passwordData.get("newPassword");

            if (oldPassword == null || newPassword == null) {
                return ResponseEntity.badRequest()
                        .body("Old password and new password are required");
            }

            boolean success = userService.changePassword(uid, oldPassword, newPassword);
            if (success) {
                return ResponseEntity.ok("Password changed successfully");
            } else {
                return ResponseEntity.badRequest().body("Old password is incorrect");
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Failed to change password: " + e.getMessage());
        }
    }
}