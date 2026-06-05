package app.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import lombok.Data;
import java.util.List;

@Configuration
@ConfigurationProperties(prefix = "app.cors")
@Data
public class CorsProperties {
    private List<String> allowedOrigins;
    private List<String> allowedMethods;
    private List<String> allowedHeaders;
    private Boolean allowCredentials;
    private Long maxAge;
}
