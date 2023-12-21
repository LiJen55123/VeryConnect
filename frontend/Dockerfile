# Stage 1: Build Stage
FROM node:20 AS build-stage

WORKDIR /app
# Install Angular CLI globally
RUN npm i -g @angular/cli

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install all the dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the Angular application in production mode
RUN ng build --configuration production


# Stage 2: Runtime Stage
FROM nginx:alpine AS runtime-stage

# Copy the build output from the build stage
COPY --from=build-stage /app/dist/frontend/browser /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx and serve the application

