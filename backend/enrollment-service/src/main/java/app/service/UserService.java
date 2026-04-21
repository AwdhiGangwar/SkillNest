package app.service;

import app.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class UserService {

    private static final String USER_SERVICE_URL = "http://localhost:8080/api/users";
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private RestTemplate restTemplate;

    public User getUserById(String userId) {
        try {
            logger.info("Fetching user: {}", userId);
            User user = restTemplate.getForObject(USER_SERVICE_URL + "/" + userId, User.class);
            
            if (user == null) {
                logger.warn("User not found: {}", userId);
                return null;
            }
            
            logger.info("User found: {}", userId);
            return user;
        } catch (org.springframework.web.client.ResourceAccessException e) {
            logger.warn("Connection error fetching user {}, retrying: {}", userId, e.getMessage());
            try {
                Thread.sleep(500);
                return restTemplate.getForObject(USER_SERVICE_URL + "/" + userId, User.class);
            } catch (Exception retryEx) {
                logger.error("Retry failed for user {}: {}", userId, retryEx.getMessage());
                return null;
            }
        } catch (org.springframework.web.client.HttpClientErrorException.NotFound e) {
            logger.warn("User not found: {}", userId);
            return null;
        } catch (Exception e) {
            logger.error("Failed to fetch user {}: {}", userId, e.getMessage());
            return null;
        }
    }
}
