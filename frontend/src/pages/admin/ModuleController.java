package app.controller;

import app.model.Module;
import app.service.ModuleService;
import app.service.CourseService;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/modules")
public class ModuleController {

    @Autowired
    private ModuleService moduleService;

    @Autowired
    private CourseService courseService;

    private static final Logger logger = LoggerFactory.getLogger(ModuleController.class);

    @PostMapping
    public ResponseEntity<?> createModule(@RequestBody Module module, HttpServletRequest request) {
        try {
            String uid = (String) request.getAttribute("uid");
            String token = request.getHeader("Authorization");

            if (!courseService.isTeacher(uid, token)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Unauthorized: Only teachers/admins can create modules"));
            }

            if (module.getId() == null) module.setId(UUID.randomUUID().toString());
            
            String moduleId = moduleService.createModule(module);
            return ResponseEntity.ok(Map.of("success", true, "moduleId", moduleId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<?> getModulesByCourse(@PathVariable String courseId) {
        try {
            logger.info("Fetching modules for course: {}", courseId);
            List<Module> modules = moduleService.getModulesByCourse(courseId);
            return ResponseEntity.ok(modules);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to get modules: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{moduleId}")
    public ResponseEntity<?> deleteModule(@PathVariable String moduleId, HttpServletRequest request) {
        try {
            String uid = (String) request.getAttribute("uid");
            String token = request.getHeader("Authorization");

            if (!courseService.isTeacher(uid, token)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Unauthorized"));
            }

            moduleService.deleteModule(moduleId);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}