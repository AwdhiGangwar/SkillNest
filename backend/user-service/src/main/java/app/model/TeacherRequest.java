package app.model;

public class TeacherRequest {

    private String id;
    private String name;
    private String email;
<<<<<<< HEAD
    private String phone;
=======
>>>>>>> ca9e6a8546d45fdcb2d8dbf6b42011e2c1e874cb
    private String skills;
    private String experience;
    private String bio;
    private String status; // PENDING, APPROVED, REJECTED
    private long createdAt;

    // getters & setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

<<<<<<< HEAD
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

=======
>>>>>>> ca9e6a8546d45fdcb2d8dbf6b42011e2c1e874cb
    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public long getCreatedAt() { return createdAt; }
    public void setCreatedAt(long createdAt) { this.createdAt = createdAt; }
}