# Stage 1: Build
FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /build

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

RUN apk add --no-cache dumb-init

COPY --from=builder /build/target/skillnest-user-service-*.jar user-service.jar

RUN addgroup -g 1001 appuser && \
    adduser -u 1001 -G appuser -s /sbin/nologin -D appuser && \
    chown -R appuser:appuser /app

USER appuser

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget -O- http://localhost:8081/actuator/health || exit 1

EXPOSE 8081

ENTRYPOINT ["dumb-init", "--"]
CMD ["java", \
     "-Xmx512m", \
     "-Xms256m", \
     "-XX:+UseG1GC", \
     "-Djava.security.egd=file:/dev/./urandom", \
     "-Dspring.profiles.active=${SPRING_PROFILE:prod}", \
     "-jar", \
     "user-service.jar"]
