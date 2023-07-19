# FROM node:16

# # Install Docker CLI
# RUN apt-get update && \
#     apt-get install -y apt-transport-https ca-certificates curl gnupg-agent software-properties-common && \
#     apt-get update && \
#     curl -sSL https://get.docker.com/ | sh && \
#     apt-get install -y docker redis-server && \
#     rm -rf /var/lib/apt/lists/*

# # # Set up Docker client configuration
# # RUN mkdir -p /root/.docker
# # COPY config.json /root/.docker/config.json

# WORKDIR /app
# COPY server/. .

# # FROM node:16 AS client
# # WORKDIR /app
# # COPY client/package*.json ./client/
# # RUN cd client && npm install
# # COPY client/. ./client/

# # Combine server and client
# # FROM node:16
# # WORKDIR /app

# # Copy server and client code from previous stages
# # COPY --from=server /app/server ./server
# # COPY --from=client /app/client ./client

# ENV PORT=5000
# ENV DB_PASSWORD=WDRe0hMVNI8ddFa9
# ENV DB_URL=mongodb+srv://tanmay:<password>@cluster0.odgofwl.mongodb.net/online_judge?retryWrites=true&w=majority
# ENV JWT_SECRET=MY_SECRET

# RUN npm install
# RUN npm uninstall bcrypt
# RUN npm install bcrypt
# RUN service docker start
# RUN docker run -v /var/run/docker.sock:/var/run/docker.sock oj-image
# # RUN docker pull gcc:latest
# # RUN docker pull python:3.10-slim
# # RUN docker pull node:16.17.0-bullseye-slim
# # RUN docker pull openjdk:20-slim


# EXPOSE 5000

# CMD ["/bin/bash", "-c", "redis-server & npm start"]

# Use the official Node.js image as a base image
FROM node:16

# Install necessary packages
# RUN apt-get update && \
#     apt-get install -y apt-transport-https ca-certificates curl gnupg-agent software-properties-common && \
#     apt-get update && \
#     curl -sSL https://get.docker.com/ | sh && \
#     apt-get install -y docker redis-server && \
#     rm -rf /var/lib/apt/lists/*


RUN apt-get install -y docker redis-server

#  Use the environment variables in your application code
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
RUN service docker start
RUN npm uninstall bcrypt
RUN npm install bcrypt
RUN docker pull gcc:latest
RUN docker pull python:3.10-slim
RUN docker pull node:16.17.0-bullseye-slim
RUN docker pull openjdk:20-slim

# Expose the necessary ports
EXPOSE 5000

# Start the Node.js server
CMD ["redis-server & npm start"]