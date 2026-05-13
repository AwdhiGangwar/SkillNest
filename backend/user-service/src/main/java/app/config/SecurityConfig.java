package app.config;

import app.filter.FirebaseTokenFilter;
<<<<<<< HEAD
import org.springframework.boot.web.servlet.FilterRegistrationBean;
=======
import jakarta.servlet.Filter;
>>>>>>> ca9e6a8546d45fdcb2d8dbf6b42011e2c1e874cb
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SecurityConfig {

    @Bean
<<<<<<< HEAD
    public FilterRegistrationBean<FirebaseTokenFilter> firebaseFilter() {
        FilterRegistrationBean<FirebaseTokenFilter> registration = new FilterRegistrationBean<>();

        registration.setFilter(new FirebaseTokenFilter());

        // 🔥 IMPORTANT: kis URLs pe filter lagega
        registration.addUrlPatterns("/api/*");

        // priority
        registration.setOrder(1);

        return registration;
=======
    public Filter firebaseTokenFilter() {
        return new FirebaseTokenFilter();
>>>>>>> ca9e6a8546d45fdcb2d8dbf6b42011e2c1e874cb
    }
}