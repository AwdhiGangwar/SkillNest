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
        registration.addUrlPatterns("/*"); // 🔥 IMPORTANT
        registration.setOrder(1);

        return registration;
    }
}