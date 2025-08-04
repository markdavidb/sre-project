# Full-Stack SRE Project

This project is a full-stack web application with a React frontend and a Node.js backend, containerized using Docker.

## Project Structure

```
.
├── backend/         # Node.js backend service
├── frontend/        # React frontend service
└── docker-compose.yml # Docker Compose configuration
```

## Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Node.js](https://nodejs.org/) (for local development)

## Getting Started

### 1. Environment Configuration

The backend service requires a `.env` file for configuration, including database credentials.

Create a `.env` file inside the `backend` directory:

```bash
# backend/.env

# Server Configuration
PORT=5000
CORS_ORIGIN=http://localhost:3000

# Database (TiDB)
DB_HOST=your_tidb_host
DB_PORT=4000
DB_USER=your_tidb_user
DB_PASS=your_tidb_password
DB_NAME=your_tidb_database

# JWT
JWT_SECRET=your_jwt_secret

# SSL Certificate for TiDB
CA_PATH=/app/certs/isrgrootx1.pem
```

### 2. Build and Run with Docker

To build and run the entire application stack, use Docker Compose:

```bash
docker-compose up --build
```

This command will:
- Build the Docker images for the frontend and backend services.
- Start the containers.

### 3. Accessing the Application

Once the containers are running, you can access the services at the following URLs:

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5000](http://localhost:5000)

## Services

- **`frontend`**: A React application built with Vite that serves as the user interface.
- **`backend`**: A Node.js Express server that provides the API and connects to the TiDB database.

