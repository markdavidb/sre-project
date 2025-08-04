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

### 2. Database Schema

Before starting the application, create the necessary tables in your TiDB or MySQL-compatible database.

Run the following SQL:

```sql
-- Switch to your database
USE test;

-- Create 'users' table
CREATE TABLE users (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username        VARCHAR(50)     NOT NULL UNIQUE,
  email           VARCHAR(100)    NOT NULL UNIQUE,
  password_hash   VARCHAR(100)    NOT NULL,
  created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Create 'user_tokens' table
CREATE TABLE user_tokens (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id       BIGINT UNSIGNED NOT NULL,
  token         VARCHAR(512)    NOT NULL UNIQUE,
  expires_at    DATETIME        NOT NULL,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_tokens_user (user_id)
) ENGINE=InnoDB;

-- Create 'password_reset_tokens' table
CREATE TABLE password_reset_tokens (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id       BIGINT UNSIGNED NOT NULL,
  token         CHAR(64)        NOT NULL UNIQUE,
  expires_at    DATETIME        NOT NULL,
  used          TINYINT(1)      NOT NULL DEFAULT 0,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_prt_user (user_id)
) ENGINE=InnoDB;
```

### 3. Build and Run with Docker

To build and run the entire application stack, use Docker Compose:

```bash
docker-compose up --build
```

This command will:
- Build the Docker images for the frontend and backend services.
- Start the containers.

### 4. Accessing the Application

Once the containers are running, you can access the services at the following URLs:

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5000](http://localhost:5000)

## Services

- **`frontend`**: A React application built with Vite that serves as the user interface.
- **`backend`**: A Node.js Express server that provides the API and connects to the TiDB database.
