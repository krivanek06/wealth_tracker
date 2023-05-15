# Use the official Node.js 16 image as the base image for this Dockerfile
FROM node:16 as build

# Set the working directory for subsequent commands
WORKDIR usr/src/app

# Copy the package.json and package-lock.json files into the container
COPY package*.json ./

# Install the latest version of the Angular CLI
RUN yarn global add @angular/cli@15.2.8

# Install dependencies specified in package.json
RUN yarn install

# Copy local angular/nest code to the container
COPY . .

# Build the Angular Universal application
RUN yarn run build:ssr

# Start the server
CMD ["yarn", "run", "serve:ssr"]
