package app.service;

import app.model.Availability;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AvailabilityService {

    private static final String COLLECTION = "availability";

    public List<Availability> getTeacherAvailability(String teacherId) throws Exception {

        Firestore db = FirestoreClient.getFirestore();

        return db.collection(COLLECTION)
                .whereEqualTo("teacherId", teacherId)
                .get()
                .get()
                .getDocuments()
                .stream()
                .map(doc -> doc.toObject(Availability.class))
                .toList();
    }

    public Availability addSlot(Availability slot) throws Exception {

        Firestore db = FirestoreClient.getFirestore();

        if (slot.getId() == null) {
            slot.setId(java.util.UUID.randomUUID().toString());
        }

        slot.setStatus("available");

        db.collection(COLLECTION)
                .document(slot.getId())
                .set(slot)
                .get();

        return slot;
    }
}