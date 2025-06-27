# Stage 1: Build the application
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the Maven build files (pom.xml) and source code
# to leverage Docker layer caching
COPY pom.xml .
COPY src ./src

# Build the application
# Use -DskipTests to skip tests during build for faster deployment
RUN mvn clean install -DskipTests

# Stage 2: Create the final image
# Use a smaller base image for the final runtime
FROM eclipse-temurin:17-jre-alpine

# Set the working directory for the application
WORKDIR /app

# Copy the executable JAR from the build stage
COPY --from=build /app/target/pos-backend-0.0.1-SNAPSHOT.jar .

# Expose the port your Spring Boot application listens on
# Render uses PORT environment variable
EXPOSE 8080

# Command to run the application with docker profile
ENTRYPOINT ["java", "-Dspring.profiles.active=docker", "-Dserver.port=${PORT:-8080}", "-jar", "pos-backend-0.0.1-SNAPSHOT.jar"] 