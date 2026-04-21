package app.controller;

import app.model.Module;
import app.model.Lesson;
import app.service.ModuleService;
import app.service.LessonService;
import app.service.ProgressService;
import app.service.CourseService;
import app.dto.ModuleDTO;
import app.dto.LessonDTO;
import app.dto.CourseContentDTO;
import app.model.Progress;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/modules")
public class ModuleController {

    @Autowired
    private ModuleService moduleService;

    @Autowired
    private LessonService lessonService;

    @Autowired
    private ProgressService progressService;

    @Autowired
    private CourseService courseService;

    private static final Logger logger = LoggerFactory.getLogger(ModuleController.class);

    @PostMapping
    public ResponseEntity<?> createModule(@RequestBody Module module, HttpServletRequest request) {
        try {
            String uid = (String) request.getAttribute("uid");
            String token = request.getHeader("Authorization");

            logger.info("Module creation request from UID: {}", uid);

            if (!courseService.isTeacher(uid, token)) {
                logger.warn("User {} is not authorized to create modules", uid);
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Only teachers or admins can create modules"));
            }

            String moduleId = moduleService.createModule(module);
            return ResponseEntity.ok(Map.of("success", true, "moduleId", moduleId));
        } catch (Exception e) {
            logger.error("Error creating module: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create module: " + e.getMessage()));
        }
    }

    @GetMapping("/{moduleId}")
    public ResponseEntity<?> getModule(@PathVariable String moduleId) {
        try {
            Module module = moduleService.getModule(moduleId);
            if (module == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(module);
        } catch (Exception e) {
            logger.error("Error getting module: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to get module: " + e.getMessage()));
        }
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<?> getModulesByCourse(@PathVariable String courseId) {
        try {
            List<Module> modules = moduleService.getModulesByCourse(courseId);
            return ResponseEntity.ok(modules);
        } catch (Exception e) {
            logger.error("Error getting modules for course: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to get modules: " + e.getMessage()));
        }
    }

    @PutMapping("/{moduleId}")
    public ResponseEntity<?> updateModule(@PathVariable String moduleId, @RequestBody Module module, HttpServletRequest request) {
        try {
            String uid = (String) request.getAttribute("uid");
            String token = request.getHeader("Authorization");

            logger.info("Module update request from UID: {}", uid);

            if (!courseService.isTeacher(uid, token)) {
                logger.warn("User {} is not authorized to update modules", uid);
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Only teachers or admins can update modules"));
            }

            module.setId(moduleId);
            moduleService.updateModule(moduleId, module);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            logger.error("Error updating module: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update module: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{moduleId}")
    public ResponseEntity<?> deleteModule(@PathVariable String moduleId, HttpServletRequest request) {
        try {
            String uid = (String) request.getAttribute("uid");
            String token = request.getHeader("Authorization");

            logger.info("Module deletion request from UID: {}", uid);

            if (!courseService.isTeacher(uid, token)) {
                logger.warn("User {} is not authorized to delete modules", uid);
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Only teachers or admins can delete modules"));
            }

            moduleService.deleteModule(moduleId);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            logger.error("Error deleting module: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to delete module: " + e.getMessage()));
        }
    }

    @PostMapping("/{moduleId}/reorder")
    public ResponseEntity<?> reorderModules(@PathVariable String moduleId, @RequestBody Map<String, List<String>> request, HttpServletRequest httpRequest) {
        try {
            String uid = (String) httpRequest.getAttribute("uid");
            String token = httpRequest.getHeader("Authorization");

            logger.info("Module reorder request from UID: {}", uid);

            if (!courseService.isTeacher(uid, token)) {
                logger.warn("User {} is not authorized to reorder modules", uid);
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Only teachers or admins can reorder modules"));
            }

            List<String> moduleIds = request.get("moduleIds");
            Module module = moduleService.getModule(moduleId);
            moduleService.reorderModules(module.getCourseId(), moduleIds);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            logger.error("Error reordering modules: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to reorder modules: " + e.getMessage()));
        }
    }
}
