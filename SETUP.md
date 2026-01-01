# 🚀 FountainCMS Local Setup Guide

Welcome to **FountainCMS**! This guide will help you set up the project locally for development. It covers both the Backend (NestJS) and Frontend (React/Vite) setup.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **[Node.js](https://nodejs.org/)** (v18 or higher recommended)
- **[npm](https://www.npmjs.com/)** (comes with Node.js)
- **[Git](https://git-scm.com/)**
- **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** (Recommended for running the database/backend easily)
> ⚠️ LTS versions of Node.js (v18 or v20) are recommended.
> Very new versions may cause unexpected issues.


---

## 🛠️ Project Setup

### 1. Clone the Repository
```bash
git clone https://github.com/building-for-fun/fountainCms.git

cd fountainCms
```

---

## 🐘 Backend Setup

The backend is built with **NestJS** and uses **PostgreSQL** with **Prisma**.

### Option A: Standard Local Setup (Recommended for Dev)

#### 1. Navigate to the backend directory
```bash
cd backend
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Environment Configuration
Create a `.env` file from the sample:
```bash
cp .env.sample .env
```
Open `.env` and verify the `DATABASE_URL`. If you are using the Docker setup provided in step 4, it should look like this:
```env
DATABASE_URL="postgresql://fountain_user:fountain_pass@localhost:5433/fountain_db?schema=public"
```

#### 4. Start the Database (Docker)
Run the database container only. From the **project root** (one level up from `backend`):
```bash
docker-compose up -d postgres
```
This starts a PostgreSQL instance on local port **5433** (DB user: `fountain_user`, pass: `fountain_pass`).

#### 5. Setup Database Schema (Prisma)

This step ensures Prisma types are generated correctly.
```bash
npm run prisma:generate
```

#### 6. Run Migrations
Run the migrations to create the tables in your database:
```bash
# Run this inside the 'backend' directory
npm run prisma:migrate:dev
```
> Note: After migrations, the database will be empty.
> You may need to create data via API endpoints or seed scripts (if available).


#### 7. Start the Backend Server
Start the server in development mode:
```bash
npm run start:dev
```
- The backend API will run at: **http://localhost:3000**
- Swagger API Docs (if enabled): **http://localhost:3000/api**

### Option B: Full Stack Backend with Docker (Alternative)

If you strictly want to run the backend and database without installing NestJS dependencies locally:

Make sure you create a dockerfile in backend with the following content:

```bash
> Note: If you plan to run the backend via Docker, ensure a valid `Dockerfile`
> exists in the `backend/` directory. At the time of writing, this may need
> to be added manually or tracked as a separate improvement.
```

1. Ensure you are in the **project root**.
2. Run the full stack:
```bash
docker-compose up -d
```
3. This starts BOTH **Postgres** and the **Backend API**.
   - Backend API: **http://localhost:3000**
   - Database: **localhost:5433**


*Note: For active development (changing code), Option A is preferred.*
> If you are using Docker Compose v2, use `docker compose`.
> For older versions, use `docker-compose`.

---

## ⚛️ Frontend Setup

The frontend is built with **React** and **Vite**.

### 1. Navigate to the frontend directory
Open a new terminal window and run:
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```
- The frontend will commonly run at: **http://localhost:5173** (check terminal for exact port)

---

> Note: The frontend expects the backend to be running on `http://localhost:3000`.
> Ensure the backend is started before using the frontend.


## ✅ Verification

To confirm everything is working:
1. Ensure the **Backend** is running (via `npm run start:dev` or Docker).
2. Ensure the **Database** is running.
3. Ensure the **Frontend** is running (`npm run dev` in `frontend/`).
4. Open the Frontend URL in your browser.

## 🟢 Setup Checklist

- Backend running at http://localhost:3000
- Frontend running at http://localhost:5173
- PostgreSQL running on port 5433
- No Prisma errors in terminal

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| `DATABASE_URL` error | Ensure `.env` exists in `backend/` and credentials match `docker-compose.yml`. |
| Connection Refused (DB) | Ensure Docker container is running (`docker ps`) and port `5433` is available. |
| Port 3000/5173 in use | Stop other services or change ports in configuration files. |
| Prisma errors | Try running `rm -rf node_modules` and `npm install`, then `npm run prisma:generate`. |