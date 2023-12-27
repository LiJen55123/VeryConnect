# Stage 1: Build Stage
FROM node:20 AS build-stage

ARG DEV
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
RUN if [ "$DEV" = "true" ]; then echo "DEV mode is" $DEV; else  echo "DEV mode is" && ng build --configuration production; fi

# Stage 2: Runtime Stage
FROM nginx:alpine AS runtime-stage

# Copy the build output from the build stage
COPY --from=build-stage /app/dist/frontend/browser /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx and serve the application

