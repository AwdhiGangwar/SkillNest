package app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategorizedUsersDTO {
    
    private List<UserDTO> students;
    private List<UserDTO> teachers;
    private List<UserDTO> blockedUsers;
    
    private int totalStudents;
    private int totalTeachers;
    private int totalBlocked;
    private int totalActive;
}
