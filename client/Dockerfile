# Use the official Node.js 16 image as the base image for this Dockerfile
FROM node:16 as build

# Set the working directory for subsequent commands
WORKDIR /app

# Copy the package.json and package-lock.json files into the container
COPY ./package*.json /app/

# Install the latest version of the Angular CLI
RUN yarn global add @angular/cli@15.2.8

# Install dependencies specified in package.json
RUN yarn install

# Copy the rest of the application source code into the container
COPY . /app/

# Build the Angular Universal application
RUN yarn run build:ssr

# Use the official Nginx 1.23.0-alpine image as the base image for the client browser container
FROM nginx:1.23.0-alpine AS client-browser

# Copy the Nginx configuration file into the container
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built client browser files into the Nginx document root
COPY --from=build /app/dist/client/browser /usr/share/nginx/html

# Use the official Node.js 16 image as the base image for the server-side rendering container
FROM node:16 AS ssr-server

# Copy the built server-side rendering files into the container
COPY --from=build /app/dist /app/dist/

# Copy the package.json file into the container
COPY ./package.json /app/package.json

# Install dependencies specified in package.json
WORKDIR /app

# Expose port 8080 for the server to listen on
EXPOSE 8080

# Start the server
CMD yarn run serve:ssr
