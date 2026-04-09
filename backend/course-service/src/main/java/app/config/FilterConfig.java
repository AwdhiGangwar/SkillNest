package app.config;

import app.filter.FirebaseTokenFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfig {

    @Bean
    public FilterRegistrationBean<FirebaseTokenFilter> firebaseTokenFilter() {
        FilterRegistrationBean<FirebaseTokenFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new FirebaseTokenFilter());
        registrationBean.addUrlPatterns("/api/*");
        registrationBean.setOrder(1);
        return registrationBean;
    }
}
