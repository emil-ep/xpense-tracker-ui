# Stage 1: Build the React app
FROM node:18.14.1 as build

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project directory into the container
COPY . .

# Build the React application
RUN npm run build

# Stage 2: Serve the app using NGINX
FROM nginx:stable-alpine

# Copy the React build output to the NGINX HTML directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy the custom NGINX configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the container
EXPOSE 80

# Start NGINX when the container launches
CMD ["nginx", "-g", "daemon off;"]
