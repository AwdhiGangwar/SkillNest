package app.config;

import app.filter.FirebaseTokenFilter;
import jakarta.servlet.Filter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SecurityConfig {

    @Bean
    public Filter firebaseTokenFilter() {
        return new FirebaseTokenFilter();
    }
}