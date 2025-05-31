# Use official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Install netcat-openbsd (nc) and curl for health checks
RUN apk add --no-cache netcat-openbsd curl

# Install grpc_health_probe (optional but recommended)
RUN curl -fsSL https://github.com/grpc-ecosystem/grpc-health-probe/releases/download/v0.4.14/grpc_health_probe-linux-amd64 -o /bin/grpc_health_probe \
    && chmod +x /bin/grpc_health_probe

# Copy package files and install dependencies
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN if [ -f yarn.lock ]; then yarn install; \
    elif [ -f package-lock.json ]; then npm install; \
    elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install; \
    else echo "No lockfile found." && exit 1; fi

# Copy the rest of the code
COPY package*.json ./
COPY /apps ./apps
COPY /libs ./libs


EXPOSE 3000 3001 3002 3003

# Default command (overridden by docker-compose)
CMD ["sh"]
