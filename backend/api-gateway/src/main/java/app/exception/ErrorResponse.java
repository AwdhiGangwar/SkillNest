package app.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {
    private String status;
    private String message;
    private String error;
    private int code;
    private String path;
    private LocalDateTime timestamp;
}
