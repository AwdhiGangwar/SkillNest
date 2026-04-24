package app.service;

import app.model.TeacherRequest;

import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TeacherRequestService {

    private static final String COLLECTION = "teacher_requests";

    public String createRequest(TeacherRequest req) throws Exception {
        Firestore db = FirestoreClient.getFirestore();

        req.setId("req_" + UUID.randomUUID());
        req.setStatus("PENDING");
        req.setCreatedAt(System.currentTimeMillis());

        db.collection(COLLECTION)
                .document(req.getId())
                .set(req)
                .get();

        return "Request submitted successfully";
    }

    public List<TeacherRequest> getAllRequests() throws Exception {
        Firestore db = FirestoreClient.getFirestore();

        return db.collection(COLLECTION)
                .whereEqualTo("status", "PENDING")
                .get()
                .get()
                .getDocuments()
                .stream()
                .map(doc -> doc.toObject(TeacherRequest.class))
                .collect(Collectors.toList());
    }

    public TeacherRequest approveRequest(String id) throws Exception {
        Firestore db = FirestoreClient.getFirestore();

        TeacherRequest req = db.collection(COLLECTION)
                .document(id)
                .get()
                .get()
                .toObject(TeacherRequest.class);

        if (req == null) {
            throw new RuntimeException("Request not found");
        }

        req.setStatus("APPROVED");

        db.collection(COLLECTION)
                .document(id)
                .set(req)
                .get();

        return req;
    }

    public TeacherRequest getRequestById(String id) throws Exception {
        Firestore db = FirestoreClient.getFirestore();

        return db.collection(COLLECTION)
                .document(id)
                .get()
                .get()
                .toObject(TeacherRequest.class);
    }
    public TeacherRequest rejectRequest(String id) throws Exception {
    Firestore db = FirestoreClient.getFirestore();

    TeacherRequest req = db.collection(COLLECTION)
            .document(id)
            .get()
            .get()
            .toObject(TeacherRequest.class);

    if (req == null) throw new RuntimeException("Request not found");

    req.setStatus("REJECTED");

    db.collection(COLLECTION)
            .document(id)
            .set(req)
            .get();

    return req;
}
}