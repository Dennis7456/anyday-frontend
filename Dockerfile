# Stage 1: Build the application
FROM node:16 AS build

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application
FROM nginx:alpine

# Copy the built application from the previous stage
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Expose the port nginx will serve on
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]