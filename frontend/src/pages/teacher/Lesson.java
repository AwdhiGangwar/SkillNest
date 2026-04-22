package app.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "lessons")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Lesson {
    @Id
    private String id;
    
    @Column(nullable = false)
    private String moduleId;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String videoUrl;
    private String notesPdfUrl;
    private int duration; // in minutes
    private boolean isPreviewFree;
    private int orderNo;
}