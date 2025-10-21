# Docker Setup

This repository is containerized for a simple, environment-free run of the client (React + Vite), server (Node + Express + Socket.io), and MongoDB.

## Prerequisites
- Docker Desktop (or Docker Engine) with Compose v2

## Start
- Build and start all services:
  - `docker compose up -d`
- Open the app:
  - Frontend: `http://localhost:5173`
  - Backend API: `http://localhost:8085`
  - MongoDB: `mongodb://localhost:27017`

## Stop
- `docker compose down`

## What’s included
- `mongo` (MongoDB 6) with named volume `mongo_data`
- `server` (Node/Express/Mongoose/Socket.io)
  - CORS allowed origin defaults to `http://localhost:5173`
  - Persists uploads to named volume `server_uploads`
  - Environment variables set via `docker-compose.yml`
- `client` (Vite build + `vite preview` on port 5173)
  - Uses `client/.env` (`VITE_SERVER_URL=http://localhost:8085`) to talk to the server

## Customize
- Change ports by editing `docker-compose.yml` (update `ORIGIN_HTTP` accordingly for CORS).
- Change database name/host:
  - Update `DATABASE_URL` in `docker-compose.yml` (e.g. `mongodb://mongo:27017/yourdb`).
- Change JWT secret:
  - Update `JWT_KEY` in `docker-compose.yml`.

## Notes
- HTTPS is not enabled by default. The server has commented code for HTTPS; provide certs and update env if you want to enable it.
- For live-reload development with hot reloading, we can add a dev-oriented compose that runs `vite` and `nodemon` with bind mounts—let me know if you’d like that.
