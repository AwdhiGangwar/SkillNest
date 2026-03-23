package app.controller;

import app.model.User;
import app.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
        return userService.createUser(user);
    }

    @GetMapping("/me")
    public User getCurrentUser(HttpServletRequest request) throws Exception {

        String uid = request.getHeader("uid");

        // temporary fallback (only for testing)
        if (uid == null) {
            uid = "teacher123";
        }

        return userService.getOrCreateUser(uid);
    }
}