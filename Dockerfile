# Use official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

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

# Expose ports (auth: 3001, api-gateway: 3000 by default, adjust as needed)
EXPOSE 3000 3001

# Default command (overridden by docker-compose)
CMD ["sh"]
