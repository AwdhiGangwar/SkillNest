package app.client;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@Service
public class EnrollmentServiceClient {

    private final RestTemplate restTemplate;

    public EnrollmentServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    private final String BASE_URL = "http://localhost:8083";

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

        return headers;
    }

    public List<Object> getAllEnrollments() {

        HttpEntity<String> entity = new HttpEntity<>(getHeaders());

        return restTemplate.exchange(
                BASE_URL + "/api/enrollments",
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<List<Object>>() {}
        ).getBody();
    }
}