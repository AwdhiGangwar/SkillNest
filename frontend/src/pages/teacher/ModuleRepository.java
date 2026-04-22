package app.repository;

import app.model.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ModuleRepository extends JpaRepository<Module, String> {
    List<Module> findByCourseIdOrderByOrderNoAsc(String courseId);
}