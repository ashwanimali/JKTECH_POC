# api_gateway/Dockerfile
FROM node:22.14.0-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies first (better caching)
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Make sure run.sh is executable
RUN chmod +x run.sh

# Expose the app port
EXPOSE 3000

# Default command
CMD [ "sh", "run.sh" ]
