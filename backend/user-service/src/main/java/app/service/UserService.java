package app.service;

import app.model.User;

import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private static final String COLLECTION_NAME = "users";

    public String createUser(User user) throws Exception {
        Firestore db = FirestoreClient.getFirestore();

        db.collection(COLLECTION_NAME)
                .document(user.getId())
                .set(user)
                .get();

        return "User created successfully";
    }

    public User getUserById(String id) throws Exception {
        Firestore db = FirestoreClient.getFirestore();

        return db.collection(COLLECTION_NAME)
                .document(id)
                .get()
                .get()
                .toObject(User.class);
    }

    public User getOrCreateUser(String uid) throws Exception {

        Firestore db = FirestoreClient.getFirestore();

        User user = db.collection(COLLECTION_NAME)
                .document(uid)
                .get()
                .get()
                .toObject(User.class);

        if (user != null) {
            return user;
        }

        // create new user
        User newUser = new User();
        newUser.setId(uid);
        newUser.setName("New User");
        newUser.setEmail("default@email.com");

        // role logic
        if (uid.contains("teacher")) {
            newUser.setRole(User.ROLE_TEACHER);
        } else {
            newUser.setRole(User.ROLE_STUDENT);
        }

        db.collection(COLLECTION_NAME)
                .document(uid)
                .set(newUser)
                .get();

        return newUser;
    }
}