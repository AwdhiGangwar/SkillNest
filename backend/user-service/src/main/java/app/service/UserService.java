package app.service;

import app.model.User;

import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.UserRecord;

import org.springframework.stereotype.Service;

@Service
public class UserService {

    private static final String COLLECTION_NAME = "users";

    // ==================== CREATE NORMAL USER ====================
    public String createUser(User user) throws Exception {
        Firestore db = FirestoreClient.getFirestore();

        db.collection(COLLECTION_NAME)
                .document(user.getId())
                .set(user)
                .get();

        return "User created successfully";
    }

    // ==================== GET USER BY ID ====================
    public User getUserById(String id) throws Exception {
        Firestore db = FirestoreClient.getFirestore();

        return db.collection(COLLECTION_NAME)
                .document(id)
                .get()
                .get()
                .toObject(User.class);
    }

    // ==================== GET OR CREATE USER ====================
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

        // 🔥 create new user
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

    // ==================== 🔥 NEW: CREATE TEACHER WITH FIREBASE AUTH ====================
    public User createTeacherWithAuth(User user) throws Exception {

        // 🔥 Create user WITHOUT password
        UserRecord.CreateRequest request = new UserRecord.CreateRequest()
                .setEmail(user.getEmail());

        UserRecord userRecord = FirebaseAuth.getInstance().createUser(request);

        // 🔥 Send reset password link
        String link = FirebaseAuth.getInstance()
                .generatePasswordResetLink(user.getEmail());

        System.out.println("Reset Link: " + link); // (later email service)

        // 🔥 Save in Firestore
        user.setId(userRecord.getUid());
        user.setRole("teacher");

        Firestore db = FirestoreClient.getFirestore();

        db.collection("users")
                .document(user.getId())
                .set(user)
                .get();

        return user;
    }
}