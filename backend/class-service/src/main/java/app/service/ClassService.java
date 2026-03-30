package app.service;

import app.model.ClassEntity;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClassService {

    private static final String COLLECTION = "classes";

    public List<ClassEntity> getStudentClasses(String studentId) throws Exception {

        Firestore db = FirestoreClient.getFirestore();

        return db.collection(COLLECTION)
                .whereEqualTo("studentId", studentId)
                .get()
                .get()
                .getDocuments()
                .stream()
                .map(doc -> doc.toObject(ClassEntity.class))
                .toList();
    }

    public List<ClassEntity> getTeacherClasses(String teacherId) throws Exception {

        Firestore db = FirestoreClient.getFirestore();

        return db.collection(COLLECTION)
                .whereEqualTo("teacherId", teacherId)
                .get()
                .get()
                .getDocuments()
                .stream()
                .map(doc -> doc.toObject(ClassEntity.class))
                .toList();
    }
}