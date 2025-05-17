# Use the official Node.js image as a parent image
FROM mcr.microsoft.com/devcontainers/node:18-ubuntu

WORKDIR /KingdomKidsWorkspace/node_backend
COPY node_backend/package.json node_backend/package-lock.json* ./
RUN npm install

WORKDIR /KingdomKidsWorkspace/client
RUN npm install

# Set the working directory back to the root
WORKDIR /KingdomKidsWorkspace
COPY . .