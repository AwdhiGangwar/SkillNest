package app.model;

public class User {

    public static final String ROLE_STUDENT = "student";
    public static final String ROLE_TEACHER = "teacher";
    public static final String ROLE_ADMIN = "admin";
<<<<<<< HEAD
    public static final String STATUS_ACTIVE = "active";
    public static final String STATUS_BLOCKED = "blocked";
=======
>>>>>>> ca9e6a8546d45fdcb2d8dbf6b42011e2c1e874cb

    private String id;
    private String name;
    private String email;
    private String role;
<<<<<<< HEAD
    private String phone;
    private String bio;
    private String skills;
    private String experience;
    private String status;
=======
>>>>>>> ca9e6a8546d45fdcb2d8dbf6b42011e2c1e874cb
    private long createdAt;

    public User() {
        this.createdAt = System.currentTimeMillis();
<<<<<<< HEAD
        this.status = STATUS_ACTIVE;
=======
>>>>>>> ca9e6a8546d45fdcb2d8dbf6b42011e2c1e874cb
    }

    public User(String id, String name, String email, String role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.createdAt = System.currentTimeMillis();
<<<<<<< HEAD
        this.status = STATUS_ACTIVE;
=======
>>>>>>> ca9e6a8546d45fdcb2d8dbf6b42011e2c1e874cb
    }

    // getters & setters

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

<<<<<<< HEAD
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

=======
>>>>>>> ca9e6a8546d45fdcb2d8dbf6b42011e2c1e874cb
    public long getCreatedAt() { return createdAt; }
    public void setCreatedAt(long createdAt) { this.createdAt = createdAt; }
}