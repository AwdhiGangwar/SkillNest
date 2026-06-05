package app.exception;

import org.springframework.boot.web.reactive.error.ErrorWebExceptionHandler;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class GlobalErrorHandler implements ErrorWebExceptionHandler {

    private final ObjectMapper objectMapper;

    @Override
    public Mono<Void> handle(ServerWebExchange exchange, Throwable ex) {
        log.error("Error occurred in API Gateway", ex);

        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        
        if (ex instanceof IllegalArgumentException) {
            status = HttpStatus.BAD_REQUEST;
        } else if (ex instanceof java.nio.file.NoSuchFileException) {
            status = HttpStatus.NOT_FOUND;
        }

        ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.setStatus("ERROR");
        errorResponse.setMessage(ex.getMessage() != null ? ex.getMessage() : "An error occurred");
        errorResponse.setError(ex.getClass().getSimpleName());
        errorResponse.setCode(status.value());
        errorResponse.setPath(exchange.getRequest().getPath().value());
        errorResponse.setTimestamp(LocalDateTime.now());

        exchange.getResponse().setStatusCode(status);
        exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);

        return exchange.getResponse().writeWith(
            Mono.fromCallable(() -> {
                try {
                    return exchange.getResponse().bufferFactory()
                        .wrap(objectMapper.writeValueAsBytes(errorResponse));
                } catch (Exception e) {
                    log.error("Error serializing error response", e);
                    return exchange.getResponse().bufferFactory()
                        .wrap("Internal Server Error".getBytes());
                }
            })
        );
    }
}
