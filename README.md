# Task Management System

A monorepo-based microservices project for managing tasks, users, and authentication, built with Nx, NestJS, and TypeScript. This project is organized into multiple apps and libraries for modularity and scalability.

## Table of Contents

- [Project Structure](#project-structure)
- [Setup](#setup)
- [Running the Project](#running-the-project)
- [Testing](#testing)
- [Docker & Docker Compose](#docker--docker-compose)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [API Documentation](#api-documentation)

---

## Project Structure

```text
apps/
  api-gateway/      # Main API gateway service
  auth/             # Authentication microservice
  task/             # Task management microservice
  user/             # User management microservice
libs/
  common/           # Shared libraries (config, error, logger, etc.)
  shared/           # Shared code (cache, protos, etc.)
```

## Setup

### Prerequisites

- Node.js (v18 or v20 recommended)
- Yarn or npm
- Docker & Docker Compose (for containerized development)

### Install Dependencies

Clone the repository

```sh
git clone https://github.com/victorex27/task_management_system.git && cd task_management_system
```

```sh
yarn install
# or
npm install
```

### Environment Variables

Each app has a `sample.env` file. Copy it to `.env` and fill in the required values:

```sh
cp apps/auth/sample.env apps/auth/.env
cp apps/api-gateway/sample.env apps/api-gateway/.env
cp apps/task/sample.env apps/task/.env
cp apps/user/sample.env apps/user/.env
```

## Running the Project

### With Nx (Locally)

Start each service in a separate terminal:

```sh
npx nx run auth:serve
npx nx run api-gateway:serve
npx nx run task:serve
npx nx run user:serve
```

Or run all in parallel:

```sh
npx nx run-many --target=serve --all
```

### With Docker Compose

Build and start all services:

```sh
docker-compose up --build
```

- The `auth` service will start first.
- The `api-gateway` will wait for `auth` to be healthy before starting.
- Code changes on your host are reflected in the containers via volumes.

## Testing

### Unit & Integration Tests

Each app and library has its own tests. To run all tests:

```sh
npx nx run-many --target=test --all
```

To test a specific app or library:

```sh
npx nx test api-gateway
npx nx test auth
npx nx test task
npx nx test user
```

### End-to-End (E2E) Tests

Each app has a corresponding `-e2e` project. To run E2E tests:

```sh
npx nx e2e api-gateway-e2e
npx nx e2e auth-e2e
npx nx e2e task-e2e
npx nx e2e user-e2e
```

## Docker & Docker Compose

- The `Dockerfile` sets up the Node.js environment and installs dependencies.
- The `docker-compose.yml` defines services for each microservice, with volumes for live code reload.
- The `api-gateway` service depends on the `auth` service and starts only after `auth` is healthy.

## Contributing

1. Fork the repo and create your branch from `main`.
2. Make your changes and add tests as needed.
3. Run `yarn lint` and `yarn test` to ensure code quality.
4. Submit a pull request.

## API Documentation

Once the API Gateway is running (by default on port 3000), you can access the interactive API documentation powered by Swagger at:

- [http://localhost:3000/api](http://localhost:3000/api)

If you are on localhost and api-gateway port is 3000

This documentation provides details on all available endpoints, request/response schemas, authentication requirements, and allows you to interact with the API directly from your browser.

If you change the port or base path, adjust the URL accordingly.

---

For questions or support, please open an issue.
