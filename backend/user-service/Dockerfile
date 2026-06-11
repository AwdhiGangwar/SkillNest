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

COPY --from=builder /build/target/*.jar app.jar

EXPOSE 8081

ENTRYPOINT ["dumb-init","--","java","-jar","app.jar"]