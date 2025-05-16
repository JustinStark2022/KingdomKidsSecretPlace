# Use the official Node.js image as a parent image
FROM node:18-slim

# Set the working directory
WORKDIR /KingdomKidsWorkspace

# Copy the project files into the container
COPY . .

# Install backend dependencies
WORKDIR /KingdomKidsWorkspace/node_backend
RUN npm install

# Install frontend dependencies
WORKDIR /KingdomKidsWorkspace/client
RUN npm install

# Set the working directory back to the root
WORKDIR /KingdomKidsWorkspace
