package app.service;

import app.model.User;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutionException;

@Service
public class UserService {

    private static final String COLLECTION_NAME = "users";

    public String createUser(User user) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();

        db.collection(COLLECTION_NAME)
                .document(user.getId())
                .set(user)
                .get();

        return "User created successfully";
    }

    public User getUserById(String id) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();

        return db.collection(COLLECTION_NAME)
                .document(id)
                .get()
                .get()
                .toObject(User.class);
    }
}