package app.controller;

import app.model.Submission;
import app.service.SubmissionService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    @Autowired
    private SubmissionService submissionService;

    // ✅ Student submission kare
    @PostMapping
    public ResponseEntity<?> createSubmission(@RequestBody Submission submission,
                                               HttpServletRequest request) {
        try {
            String uid = (String) request.getAttribute("uid");
            if (uid == null) return ResponseEntity.status(401).body("Unauthorized");

            // ✅ Duplicate check
            if (submissionService.isAlreadySubmitted(
                    submission.getAssignmentId(), uid)) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Already submitted!"));
            }

            submission.setStudentId(uid);
            Submission saved = submissionService.createSubmission(submission);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ✅ Teacher/Admin submissions dekhe
    @GetMapping("/assignment/{assignmentId}")
    public ResponseEntity<?> getByAssignment(@PathVariable String assignmentId) {
        try {
            List<Submission> submissions = 
                submissionService.getSubmissionsByAssignment(assignmentId);
            return ResponseEntity.ok(submissions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ✅ Student apni submissions dekhe
    @GetMapping("/my")
    public ResponseEntity<?> getMySubmissions(HttpServletRequest request) {
        try {
            String uid = (String) request.getAttribute("uid");
            if (uid == null) return ResponseEntity.status(401).body("Unauthorized");

            List<Submission> submissions = 
                submissionService.getSubmissionsByStudent(uid);
            return ResponseEntity.ok(submissions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}