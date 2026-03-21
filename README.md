# Backend-Driven MERN Portfolio

This repo has been refactored from static HTML pages into a MERN workspace with:

- `client/`: React + Vite frontend
- `server/`: Express + MongoDB API
- `shared/`: content validation helpers shared by server modules

## Routes

- `/`: home portfolio page
- `/work`: all projects
- `/work/:slug`: project detail page
- `/admin`: content management UI

## API

- `GET /api/site-settings`
- `GET /api/pages/home`
- `GET /api/projects`
- `GET /api/projects/:slug`
- `PUT /api/admin/site-settings`
- `PUT /api/admin/pages/home`
- `POST /api/admin/projects`
- `PUT /api/admin/projects/:id`
- `DELETE /api/admin/projects/:id`

## Local setup

1. Install dependencies:
   - `npm install`
2. Copy env files if needed:
   - `cp server/.env.example server/.env`
   - `cp client/.env.example client/.env`
3. Start MongoDB locally or point `MONGODB_URI` to your instance.
4. Seed content:
   - `npm run seed`
5. Run the apps:
   - server: `npm run dev:server`
   - client: `npm run dev:client`

The frontend expects the API at `http://localhost:4000/api` by default.

