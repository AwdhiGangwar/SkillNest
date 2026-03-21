package app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import app.filter.FirebaseTokenFilter;
import jakarta.servlet.Filter;

@Configuration
public class SecurityConfig {

    @Bean
    public Filter firebaseTokenFilter() {
        return new FirebaseTokenFilter();
    }
}