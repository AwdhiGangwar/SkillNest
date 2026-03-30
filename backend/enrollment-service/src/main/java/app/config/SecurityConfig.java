package app.config;

import app.filter.FirebaseTokenFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SecurityConfig {

    @Bean
    public FilterRegistrationBean<FirebaseTokenFilter> firebaseFilter() {
        FilterRegistrationBean<FirebaseTokenFilter> registration = new FilterRegistrationBean<>();

        registration.setFilter(new FirebaseTokenFilter());

        // 🔥 IMPORTANT: kis URLs pe filter lagega
        registration.addUrlPatterns("/*");

        // priority
        registration.setOrder(1);

        return registration;
    }
}