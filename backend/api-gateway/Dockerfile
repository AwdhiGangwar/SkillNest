# Stage 1: Build
FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /build

# Copy pom.xml
COPY pom.xml .

# Download dependencies
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build application
RUN mvn clean package -DskipTests -B

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy jar from builder
COPY --from=builder /build/target/skillnest-api-gateway-*.jar api-gateway.jar

# Create non-root user
RUN addgroup -g 1001 appuser && \
    adduser -u 1001 -G appuser -s /sbin/nologin -D appuser && \
    chown -R appuser:appuser /app

USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget -O- http://localhost:8080/actuator/health || exit 1

# Expose port
EXPOSE 8080

# Run application
ENTRYPOINT ["dumb-init", "--"]
CMD ["java", \
     "-Xmx512m", \
     "-Xms256m", \
     "-XX:+UseG1GC", \
     "-XX:MaxGCPauseMillis=200", \
     "-XX:+ParallelRefProcEnabled", \
     "-Djava.security.egd=file:/dev/./urandom", \
     "-Dspring.profiles.active=${SPRING_PROFILE:prod}", \
     "-jar", \
     "api-gateway.jar"]
