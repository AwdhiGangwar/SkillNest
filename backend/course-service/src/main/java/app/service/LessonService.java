package app.service;

import app.model.Lesson;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import com.google.firebase.cloud.StorageClient;
import com.google.cloud.storage.Bucket;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
public class LessonService {

    private static final String COLLECTION = "lessons";
    private static final Logger logger = LoggerFactory.getLogger(LessonService.class);

    public String createLesson(Lesson lesson) throws Exception {
        if (lesson.getId() == null || lesson.getId().isEmpty()) {
            lesson.setId(UUID.randomUUID().toString());
        }

        Firestore db = FirestoreClient.getFirestore();
        db.collection(COLLECTION).document(lesson.getId()).set(lesson).get();
        return lesson.getId();
    }

    // Naya Method: Video Upload ke saath Lesson Create
    public String createLessonWithVideo(MultipartFile file, Lesson lesson) throws Exception {
        if (lesson.getId() == null || lesson.getId().isEmpty()) {
            lesson.setId(UUID.randomUUID().toString());
        }

        if (file != null && !file.isEmpty()) {
            String fileName = "lessons/" + lesson.getId() + "/" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
            
            Bucket bucket = StorageClient.getInstance().bucket();
            bucket.create(fileName, file.getInputStream(), file.getContentType());

            String videoUrl = "https://firebasestorage.googleapis.com/v0/b/" 
                            + bucket.getName() 
                            + "/o/" 
                            + fileName.replace("/", "%2F") 
                            + "?alt=media";

            lesson.setVideoFileUrl(videoUrl);
            lesson.setVideoFileName(file.getOriginalFilename());
            lesson.setVideoFileSize(file.getSize());
            lesson.setVideoContentType(file.getContentType());
        }

        Firestore db = FirestoreClient.getFirestore();
        db.collection(COLLECTION).document(lesson.getId()).set(lesson).get();

        logger.info("Lesson with video created: {}", lesson.getId());
        return lesson.getId();
    }
}