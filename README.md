# Cyber Zone - Security Portal System

Production-ready Cyberzone Security Portal and information disclosure mitigation platform.

## System Folder Structure
The workspace is organized into a clean modular client-server layout:
- **`client/`**: The frontend user portal application powered by Vite, HTML5 layouts, Vanilla CSS transitions, and backend API handlers.
- **`server/`**: Node.js & Express REST API server in TypeScript utilizing Prisma ORM.
- **`server/prisma/`**: PostgreSQL database schemas and table seed scripts.
- **`server/uploads/`**: File storage directory for uploads (when running without Cloudinary cloud storage integrations).
- **`docker-compose.yml`**: Docker orchestration configurations.

## How to Get Started

### Run with Docker Compose
To boot the full-stack database and portal services:
```bash
docker-compose up --build -d
```
The portal will be active on port `5000` or port `80` (configured in docker-compose).

### Local Development Start

#### 1. Setup Backend (Server)
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Configure `.env` from `.env.example`.
3. Install dependencies and build/generate database schema:
   ```bash
   npm install
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```
4. Start backend server in development mode:
   ```bash
   npm run dev
   ```

#### 2. Setup Frontend (Client)
1. Navigate to the `client` directory in a new terminal:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start frontend dev server:
   ```bash
   npm run dev
   ```
4. Navigate to `http://localhost:5173`.
