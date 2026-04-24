package app.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.cloud.firestore.Firestore;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.UserRecord;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.cloud.FirestoreClient;

import app.model.User;
import app.dto.UserDTO;

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
   // ✅ FIXED: getOrCreateUser method
public User getOrCreateUser(String uid, String email, String name) throws Exception {

    Firestore db = FirestoreClient.getFirestore();

    User user = db.collection(COLLECTION_NAME)
            .document(uid)
            .get()
            .get()
            .toObject(User.class);

    if (user != null) {
        return user;
    }

    // 🔥 create new user with actual data
    User newUser = new User();
    newUser.setId(uid);
    newUser.setName(name != null && !name.isEmpty() ? name : "");
    newUser.setEmail(email != null && !email.isEmpty() ? email : "");  // ✅ actual email

   
        newUser.setRole(User.ROLE_STUDENT);
    

    db.collection(COLLECTION_NAME)
            .document(uid)
            .set(newUser)
            .get();

    return newUser;
}

    // ==================== 🔥 NEW: CREATE TEACHER WITH FIREBASE AUTH (PASSWORD RESET LINK) ====================
    public User createTeacherWithAuth(User user) throws Exception {

        // Validate input
        if (user.getEmail() == null || user.getEmail().isEmpty()) {
            throw new IllegalArgumentException("Email is required to create a teacher account");
        }

        // 🔥 Create user WITHOUT password
        UserRecord.CreateRequest request = new UserRecord.CreateRequest()
                .setEmail(user.getEmail());

        UserRecord userRecord;
        try {
            userRecord = FirebaseAuth.getInstance().createUser(request);

            // 🔥 Send reset password link
            String link = FirebaseAuth.getInstance()
                    .generatePasswordResetLink(user.getEmail());

            // ✅ Send welcome email with reset link
            try {
                emailService.sendTeacherWelcomeEmail(user.getEmail(), link);
            } catch (Exception e) {
                System.err.println("Warning: Failed to send welcome email: " + e.getMessage());
            }

        } catch (FirebaseAuthException fae) {
            // If email already exists, recover existing user instead of failing
            if (fae.getMessage() != null && fae.getMessage().contains("EMAIL_EXISTS")) {
                UserRecord existing = FirebaseAuth.getInstance().getUserByEmail(user.getEmail());
                userRecord = existing;
            } else {
                throw fae;
            }
        }

        // 🔥 Save in Firestore (ensure idempotent)
        user.setId(userRecord.getUid());
        user.setRole("teacher");

        Firestore db = FirestoreClient.getFirestore();

        // Create or update the Firestore document so repeat requests are idempotent
        db.collection("users").document(user.getId()).set(user).get();

        return user;
    }

    // ==================== 🔥 NEW: CREATE TEACHER WITH PASSWORD ====================
    public User createTeacherWithPassword(User user, String password) throws Exception {

        // Validate input
        if (user.getEmail() == null || user.getEmail().isEmpty()) {
            throw new IllegalArgumentException("Email is required to create a teacher account");
        }

        if (password == null || password.isEmpty() || password.length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters long");
        }

        // 🔥 Create user WITH password in Firebase
        UserRecord.CreateRequest request = new UserRecord.CreateRequest()
                .setEmail(user.getEmail())
                .setPassword(password)
                .setDisplayName(user.getName());

        UserRecord userRecord;
        try {
            userRecord = FirebaseAuth.getInstance().createUser(request);

            // ✅ Send welcome email (no reset link needed since teacher set password)
            try {
                emailService.sendTeacherAccountCreatedEmail(user.getEmail(), user.getName());
            } catch (Exception e) {
                System.err.println("Warning: Failed to send welcome email: " + e.getMessage());
            }

        } catch (FirebaseAuthException fae) {
            if (fae.getMessage() != null && fae.getMessage().contains("EMAIL_EXISTS")) {
                // Recover existing user and ensure password is set
                userRecord = FirebaseAuth.getInstance().getUserByEmail(user.getEmail());
                try {
                    // update password on existing account so login works
                    FirebaseAuth.getInstance().updateUser(
                        new com.google.firebase.auth.UserRecord.UpdateRequest(userRecord.getUid())
                            .setPassword(password)
                            .setDisplayName(user.getName())
                    );
                    // refresh userRecord after update
                    userRecord = FirebaseAuth.getInstance().getUser(userRecord.getUid());
                } catch (Exception updEx) {
                    System.err.println("Warning: Failed to update existing Firebase user password: " + updEx.getMessage());
                }
            } else {
                throw fae;
            }
        }

        // 🔥 Save in Firestore (idempotent)
        user.setId(userRecord.getUid());
        user.setRole("teacher");

        Firestore db = FirestoreClient.getFirestore();

        db.collection("users").document(user.getId()).set(user).get();

        return user;
    }
 // ================== BLOCK USER ==================
    public void blockUser(String id) throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        
        // Use a Map to update only the status field
        Map<String, Object> updates = new java.util.HashMap<>();
        updates.put("status", User.STATUS_BLOCKED);
        
        db.collection(COLLECTION_NAME)
                .document(id)
                .set(updates, com.google.cloud.firestore.SetOptions.merge())
                .get();
    }
   //=======================UNBLOCK USER ==================
    public void unblockUser(String id) throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        
        // Use a Map to update only the status field
        Map<String, Object> updates = new java.util.HashMap<>();
        updates.put("status", User.STATUS_ACTIVE);

        db.collection("users")
            .document(id)
            .set(updates, com.google.cloud.firestore.SetOptions.merge())
            .get();
    }

    // ==================== UPDATE USER PROFILE ====================
    public User updateUserProfile(String uid, User profileData) throws Exception {
        Firestore db = FirestoreClient.getFirestore();

        User existingUser = db.collection("users")
                .document(uid)
                .get()
                .get()
                .toObject(User.class);

        if (existingUser == null) {
            throw new IllegalArgumentException("User not found");
        }

        // Update only allowed fields
        if (profileData.getName() != null && !profileData.getName().isEmpty()) {
            existingUser.setName(profileData.getName());
        }
        if (profileData.getPhone() != null) {
            existingUser.setPhone(profileData.getPhone());
        }
        if (profileData.getBio() != null) {
            existingUser.setBio(profileData.getBio());
        }

        db.collection("users")
                .document(uid)
                .set(existingUser)
                .get();

        return existingUser;
    }

    // ==================== CHANGE PASSWORD ====================
    public boolean changePassword(String uid, String oldPassword, String newPassword) throws Exception {
        try {
            if (newPassword == null || newPassword.isEmpty() || newPassword.length() < 8) {
                throw new IllegalArgumentException("New password must be at least 8 characters");
            }

            // Update password in Firebase Auth
            FirebaseAuth.getInstance().updateUser(
                new com.google.firebase.auth.UserRecord.UpdateRequest(uid)
                    .setPassword(newPassword)
            );

            return true;
        } catch (Exception e) {
            throw new Exception("Failed to change password: " + e.getMessage());
        }
    }

    // ==================== GET ALL USERS AS DTO ====================
    public List<UserDTO> getAllUsersAsDTO() throws Exception {
        List<User> users = getAllUsers();
        List<UserDTO> userDTOs = new ArrayList<>();
        
        for (User user : users) {
            UserDTO dto = new UserDTO();
            dto.setId(user.getId());
            dto.setName(user.getName());
            dto.setEmail(user.getEmail());
            dto.setRole(user.getRole());
            dto.setStatus(user.getStatus() != null ? user.getStatus() : "active");
            userDTOs.add(dto);
        }
        
        return userDTOs;
    }
}