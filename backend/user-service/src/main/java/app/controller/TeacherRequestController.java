package app.controller;

import app.model.TeacherRequest;
import app.model.User;
import app.service.TeacherRequestService;
import app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/teacher-requests")
public class TeacherRequestController {

    @Autowired
    private TeacherRequestService service;

    @Autowired
    private UserService userService;

    @PostMapping
    public String createRequest(@RequestBody TeacherRequest req) throws Exception {
        return service.createRequest(req);
    }

    @GetMapping
    public List<TeacherRequest> getAll() throws Exception {
        return service.getAllRequests();
    }

    @PostMapping("/{id}/approve")
    public TeacherRequest approve(@PathVariable String id,
                                  @RequestBody(required = false) Map<String, String> body) throws Exception {
        TeacherRequest req = service.getRequestById(id);

        if (req == null) {
            throw new RuntimeException("Teacher request not found");
        }

        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setRole("teacher");

        if (body != null && body.get("password") != null && !body.get("password").isEmpty()) {
            userService.createTeacherWithPassword(user, body.get("password"));
        } else {
            userService.createTeacherWithAuth(user);
        }

        return service.approveRequest(id);
    }

    @PutMapping("/{id}/reject")
    public TeacherRequest reject(@PathVariable String id) throws Exception {
        return service.rejectRequest(id);
    }
}