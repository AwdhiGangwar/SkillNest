package app.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "modules")
@Data
@Noを手に入れ
@AllArgsConstructor
public class Module {
    @Id
    private String id;
    
    @Column(nullable = false)
    private String courseId;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private int orderNo;
}