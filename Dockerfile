# Stage 1: Build the Node.js application
FROM node:16 as builder

RUN apt-get update && \
    apt-get install -y redis-server && \
    rm -rf /var/lib/apt/lists/*


ENV PORT=5000
ENV DB_PASSWORD=WDRe0hMVNI8ddFa9
ENV DB_URL=mongodb+srv://tanmay:<password>@cluster0.odgofwl.mongodb.net/online_judge?retryWrites=true&w=majority
ENV JWT_SECRET=MY_SECRET

# Create a directory for the Node.js server code
WORKDIR /app

# Copy the Node.js server code into the container
COPY server/. .

# Install the dependencies
RUN npm install
RUN npm uninstall bcrypt
RUN npm install bcrypt

# Stage 2: Create a new container for code evaluation
FROM node:16

# Copy the built Node.js application from the previous stage
COPY --from=builder /app /app

# Set the working directory
WORKDIR /app

# Install any additional dependencies needed for evaluation
RUN apt-get update && \
    apt-get install -y gcc python3 redis-server && \
    rm -rf /var/lib/apt/lists/*

# Expose the necessary ports
EXPOSE 5000

# Start the Node.js server
CMD ["/bin/bash", "-c", "redis-server & npm start"]