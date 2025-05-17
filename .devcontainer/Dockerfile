# Use the official Node.js image as a parent image
FROM node:18-slim

WORKDIR /KingdomKidsWorkspace/node_backend
COPY node_backend/package.json ./
RUN npm install

WORKDIR /KingdomKidsWorkspace/client
RUN npm install

# Set the working directory back to the root
WORKDIR /KingdomKidsWorkspace
COPY . .