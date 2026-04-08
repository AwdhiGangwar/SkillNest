package app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
    public String createUser(@RequestBody User user) throws Exception {

        if ("TEACHER".equals(user.getRole())) {
            throw new RuntimeException("Teachers cannot self register");
        }

        return userService.createUser(user);
    }
    @GetMapping("/me")
    public User getCurrentUser(HttpServletRequest request) throws Exception {

    	String uid = (String) request.getAttribute("uid");

        if (uid == null) {
            throw new RuntimeException("Unauthorized: UID missing");
        }

        return userService.getOrCreateUser(uid);
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
}