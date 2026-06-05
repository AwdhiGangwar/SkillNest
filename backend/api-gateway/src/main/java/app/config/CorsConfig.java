package app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class CorsConfig {

    private final CorsProperties corsProperties;

    @Bean
    public CorsWebFilter corsWebFilter() {
        log.info("Configuring CORS with origins: {}", corsProperties.getAllowedOrigins());

        CorsConfiguration config = new CorsConfiguration();
        
        // Set allowed origins
        if (corsProperties.getAllowedOrigins() != null) {
            corsProperties.getAllowedOrigins().forEach(config::addAllowedOrigin);
        } else {
            config.addAllowedOriginPattern("*");
        }

        // Set allowed methods
        if (corsProperties.getAllowedMethods() != null) {
            corsProperties.getAllowedMethods().forEach(config::addAllowedMethod);
        } else {
            config.addAllowedMethod("*");
        }

        // Set allowed headers
        if (corsProperties.getAllowedHeaders() != null) {
            corsProperties.getAllowedHeaders().forEach(config::addAllowedHeader);
        } else {
            config.addAllowedHeader("*");
        }

        // Set credentials
        if (corsProperties.getAllowCredentials() != null) {
            config.setAllowCredentials(corsProperties.getAllowCredentials());
        }

        // Set max age
        if (corsProperties.getMaxAge() != null) {
            config.setMaxAge(corsProperties.getMaxAge());
        } else {
            config.setMaxAge(3600L);
        }

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsWebFilter(source);
    }
}
