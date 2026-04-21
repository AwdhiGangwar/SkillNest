package app.service;

import app.model.Module;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.firebase.cloud.FirestoreClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
public class ModuleService {

    private static final String COLLECTION = "modules";
    private static final Logger logger = LoggerFactory.getLogger(ModuleService.class);

    public String createModule(Module module) throws Exception {
        try {
            if (module.getId() == null || module.getId().isEmpty()) {
                module.setId(UUID.randomUUID().toString());
            }

            Firestore db = FirestoreClient.getFirestore();
            db.collection(COLLECTION).document(module.getId()).set(module).get();

            logger.info("Module created: {} for course: {}", module.getId(), module.getCourseId());
            return module.getId();
        } catch (Exception e) {
            logger.error("Error creating module: {}", e.getMessage(), e);
            throw e;
        }
    }

    public Module getModule(String moduleId) throws Exception {
        try {
            Firestore db = FirestoreClient.getFirestore();
            Module module = db.collection(COLLECTION).document(moduleId)
                    .get()
                    .get()
                    .toObject(Module.class);

            logger.info("Module retrieved: {}", moduleId);
            return module;
        } catch (Exception e) {
            logger.error("Error getting module: {}", e.getMessage(), e);
            throw e;
        }
    }

    public List<Module> getModulesByCourse(String courseId) throws Exception {
        try {
            Firestore db = FirestoreClient.getFirestore();
            List<Module> modules = db.collection(COLLECTION)
                    .whereEqualTo("courseId", courseId)
                    .orderBy("orderNo")
                    .get()
                    .get()
                    .toObjects(Module.class);

            logger.info("Retrieved {} modules for course: {}", modules.size(), courseId);
            return modules;
        } catch (Exception e) {
            logger.error("Error getting modules for course {}: {}", courseId, e.getMessage(), e);
            throw e;
        }
    }

    public void updateModule(String moduleId, Module module) throws Exception {
        try {
            module.setUpdatedAt(System.currentTimeMillis());
            Firestore db = FirestoreClient.getFirestore();
            db.collection(COLLECTION).document(moduleId).set(module).get();

            logger.info("Module updated: {}", moduleId);
        } catch (Exception e) {
            logger.error("Error updating module: {}", e.getMessage(), e);
            throw e;
        }
    }

    public void deleteModule(String moduleId) throws Exception {
        try {
            Firestore db = FirestoreClient.getFirestore();
            db.collection(COLLECTION).document(moduleId).delete().get();

            logger.info("Module deleted: {}", moduleId);
        } catch (Exception e) {
            logger.error("Error deleting module: {}", e.getMessage(), e);
            throw e;
        }
    }

    public void reorderModules(String courseId, List<String> moduleIds) throws Exception {
        try {
            Firestore db = FirestoreClient.getFirestore();
            for (int i = 0; i < moduleIds.size(); i++) {
                Module module = getModule(moduleIds.get(i));
                module.setOrderNo(i + 1);
                module.setUpdatedAt(System.currentTimeMillis());
                db.collection(COLLECTION).document(moduleIds.get(i)).set(module).get();
            }

            logger.info("Modules reordered for course: {}", courseId);
        } catch (Exception e) {
            logger.error("Error reordering modules: {}", e.getMessage(), e);
            throw e;
        }
    }
}
