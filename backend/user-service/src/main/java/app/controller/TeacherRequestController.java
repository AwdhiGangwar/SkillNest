package app.controller;

import app.model.TeacherRequest;
import app.service.TeacherRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import app.model.User; 
import app.service.UserService;// ✅ Yeh add karo file ke top pe
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/teacher-requests")
public class TeacherRequestController {

    @Autowired
    private TeacherRequestService service;

    @Autowired
    private UserService userService;

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
    public TeacherRequest approve(@PathVariable String id,
                                   @RequestBody(required = false) Map<String, String> body) throws Exception {

        // ✅ Step 1: Request details fetch karo
        TeacherRequest req = service.getRequestById(id);

        // ✅ Step 2: Teacher account banao Firebase Auth + Firestore mein
        if (body != null && body.get("password") != null) {
            User user = new User();
            user.setName(req.getName());
            user.setEmail(req.getEmail());
            user.setRole("teacher");
            userService.createTeacherWithPassword(user, body.get("password"));
        }

        // ✅ Step 3: Status APPROVED karo
        return service.approveRequest(id);
    }
    // Reject request
    @PutMapping("/{id}/reject")
    public TeacherRequest reject(@PathVariable String id) throws Exception {
        return service.rejectRequest(id);
    }
}