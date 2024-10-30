# Docker file for Transcoding Service

# Get latest version of node:alpine
FROM node:alpine

# Install FFmpeg and dependencies for Alpine
RUN apk update && \
    apk add --no-cache ffmpeg

# Create working directory
WORKDIR /usr/src/app

# Install all packages from Package.JSON
COPY package*.json ./

# Install 
RUN npm install

# Copy app code
COPY . .

# Expose port 5001
EXPOSE 5001

# Command to start the transcoding service
CMD ["node", "server.js"]