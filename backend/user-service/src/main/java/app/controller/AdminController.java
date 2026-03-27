package app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import app.model.TeacherRequest;
import app.service.AdminService;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // 🔹 Get all requests
    @GetMapping("/teacher-requests")
    public List<TeacherRequest> getRequests() throws Exception {
        return adminService.getAllRequests();
    }

    // 🔹 Approve
    @PutMapping("/approve/{id}")
    public String approve(@PathVariable String id) throws Exception {
        adminService.approveRequest(id);
        return "Approved";
    }

    // 🔹 Reject
    @PutMapping("/reject/{id}")
    public String reject(@PathVariable String id) throws Exception {
        adminService.rejectRequest(id);
        return "Rejected";
    }
}