package app.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.cloud.firestore.Firestore;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.UserRecord;
import com.google.firebase.cloud.FirestoreClient;

import app.model.User;

@Service
public class UserService {

    private static final String COLLECTION_NAME = "users";
    @Autowired
    private EmailService emailService;
 // ==================== GET ALL USERS ====================
    public List<User> getAllUsers() throws Exception {
        Firestore db = FirestoreClient.getFirestore();

        List<User> users = new ArrayList<>();

        db.collection(COLLECTION_NAME)
                .get()
                .get()
                .getDocuments()
                .forEach(doc -> {
                    User user = doc.toObject(User.class);
                    users.add(user);
                });

        return users;
    }
    
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

        // Validate input
        if (user.getEmail() == null || user.getEmail().isEmpty()) {
            throw new IllegalArgumentException("Email is required to create a teacher account");
        }

        // 🔥 Create user WITHOUT password
        UserRecord.CreateRequest request = new UserRecord.CreateRequest()
                .setEmail(user.getEmail());

        UserRecord userRecord = FirebaseAuth.getInstance().createUser(request);

        // 🔥 Send reset password link
        String link = FirebaseAuth.getInstance()
                .generatePasswordResetLink(user.getEmail());
        
        // ✅ Send welcome email with reset link
        try {
            emailService.sendTeacherWelcomeEmail(user.getEmail(), link);
        } catch (Exception e) {
            System.err.println("Warning: Failed to send welcome email: " + e.getMessage());
            // Continue with creating the account even if email fails
        }

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
 // ================== BLOCK USER ==================
    public void blockUser(String id) throws Exception {
        Firestore db = FirestoreClient.getFirestore();

        db.collection(COLLECTION_NAME)
                .document(id)
                .update("status", "BLOCKED")
                .get();
    }
   //=======================UNBLOCK USER ==================
    public void unblockUser(String id) throws Exception {
        Firestore db = FirestoreClient.getFirestore();

        db.collection("users")
            .document(id)
            .update("status", "ACTIVE")
            .get();
    }
}