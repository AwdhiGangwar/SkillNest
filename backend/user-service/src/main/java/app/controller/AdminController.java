package app.controller;

import java.util.List;

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
            // force role to teacher
            user.setRole("teacher");

            userService.createTeacherWithAuth(user);

            return ResponseEntity.ok("Teacher created successfully");

        } catch (Exception e) {
            e.printStackTrace(); // helpful debug
            return ResponseEntity.status(500).body("Error creating teacher");
        }
    }
}