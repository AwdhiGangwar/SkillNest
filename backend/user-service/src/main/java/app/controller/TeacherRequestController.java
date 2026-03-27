package app.controller;

import app.model.TeacherRequest;
import app.service.TeacherRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teacher-requests")
public class TeacherRequestController {

    @Autowired
    private TeacherRequestService service;

    // Create request (public)
    @PostMapping
    public String createRequest(@RequestBody TeacherRequest req) throws Exception {
        return service.createRequest(req);
    }

    // Get all (admin)
    @GetMapping
    public List<TeacherRequest> getAll() throws Exception {
        return service.getAllRequests();
    }

    // Approve request
    @PostMapping("/{id}/approve")
    public TeacherRequest approve(@PathVariable String id) throws Exception {
        return service.approveRequest(id);
    }
}