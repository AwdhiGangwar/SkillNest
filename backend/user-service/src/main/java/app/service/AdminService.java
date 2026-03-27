package app.service;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.cloud.FirestoreClient;

import app.model.TeacherRequest;

@Service
public class AdminService {

    private static final String COLLECTION = "teacherRequests";

    public List<TeacherRequest> getAllRequests() throws Exception {

        Firestore db = FirestoreClient.getFirestore();

        List<TeacherRequest> list = new ArrayList<>();

        ApiFuture<QuerySnapshot> future = db.collection(COLLECTION).get();

        for (QueryDocumentSnapshot doc : future.get().getDocuments()) {
            TeacherRequest req = doc.toObject(TeacherRequest.class);
            req.setId(doc.getId());
            list.add(req);
        }

        return list;
    }

    public void approveRequest(String id) throws Exception {

        Firestore db = FirestoreClient.getFirestore();

        DocumentReference docRef = db.collection(COLLECTION).document(id);

        docRef.update("status", "APPROVED");

        DocumentSnapshot snapshot = docRef.get().get();
        String email = snapshot.getString("email");

        db.collection("users")
                .document(email)
                .update("role", "TEACHER");
    }

    public void rejectRequest(String id) throws Exception {

        Firestore db = FirestoreClient.getFirestore();

        db.collection(COLLECTION)
                .document(id)
                .update("status", "REJECTED");
    }
}