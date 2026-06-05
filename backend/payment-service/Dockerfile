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

COPY --from=builder /build/target/skillnest-payment-service-*.jar payment-service.jar

RUN addgroup -g 1001 appuser && \
    adduser -u 1001 -G appuser -s /sbin/nologin -D appuser && \
    chown -R appuser:appuser /app

USER appuser

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget -O- http://localhost:8085/actuator/health || exit 1

EXPOSE 8085

ENTRYPOINT ["dumb-init", "--"]
CMD ["java", \
     "-Xmx512m", \
     "-Xms256m", \
     "-XX:+UseG1GC", \
     "-Djava.security.egd=file:/dev/./urandom", \
     "-Dspring.profiles.active=${SPRING_PROFILE:prod}", \
     "-jar", \
     "payment-service.jar"]
