package app.client;

import java.util.List;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import app.dto.UserDTO;
import app.model.User;
import jakarta.servlet.http.HttpServletRequest;

@Service
public class UserServiceClient {

    private final RestTemplate restTemplate;

    public UserServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    private final String BASE_URL = "http://localhost:8081";

    // 🔥 COMMON HEADER METHOD
    private HttpHeaders getHeaders() {
        HttpHeaders headers = new HttpHeaders();

        ServletRequestAttributes attributes =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            String token = request.getHeader("Authorization");

            if (token != null) {
                headers.set("Authorization", token);
            }
            
        }
        // 🔥 ADD THIS
        headers.set("X-Internal-Call", "true");

        return headers;
    }

    // ================== GET ALL USERS ==================
    public List<UserDTO> getAllUsers() {

        HttpEntity<String> entity = new HttpEntity<>(getHeaders());

        return restTemplate.exchange(
                BASE_URL + "/api/users",
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<List<UserDTO>>() {}
        ).getBody();
    }

    // ================== APPROVE TEACHER ==================
    public void approveTeacher(String userId) {

        HttpEntity<String> entity = new HttpEntity<>(getHeaders());

        restTemplate.exchange(
                BASE_URL + "/api/admin/teacher/" + userId + "/approve",
                HttpMethod.PUT,
                entity,
                Void.class
        );
    }

    // ================== BLOCK USER ==================
    public void blockUser(String userId) {
        HttpEntity<String> entity = new HttpEntity<>(getHeaders());

        restTemplate.exchange(
                BASE_URL + "/api/admin/user/" + userId + "/block",
                HttpMethod.PUT,
                entity,
                Void.class
        );
    }
    //====================ADMIN : getAllUsersAdmin ================================ 
    
    public List<UserDTO> getAllUsersAdmin() {
        HttpEntity<String> entity = new HttpEntity<>(getHeaders());

        return restTemplate.exchange(
                BASE_URL + "/api/admin/users",
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<List<UserDTO>>() {}
        ).getBody();
    }
  //====================ADMIN : UNBLOCK ================================ 
    public void unblockUser(String userId) {
        HttpEntity<String> entity = new HttpEntity<>(getHeaders());

        restTemplate.exchange(
            BASE_URL + "/api/admin/user/" + userId + "/unblock",
            HttpMethod.PUT,
            entity,
            Void.class
        );
    }
    
    public void createTeacher(User user) {
        HttpEntity<User> entity = new HttpEntity<>(user, getHeaders());

        restTemplate.exchange(
            BASE_URL + "/api/admin/create-teacher",
            HttpMethod.POST,
            entity,
            Void.class
        );
    }
}