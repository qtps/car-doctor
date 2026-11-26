# Car Doctor

A car-service storefront with a Next.js frontend and NestJS/MongoDB API. Product and service images are stored as individual files in [`frontend/public/`](./frontend/public), separate from the page code.

## Start the demo

Requirements: Docker Compose.

```bash
docker compose up --build
```

- Storefront: http://localhost:3000
- API: http://localhost:5000/api
- Health check: http://localhost:5000/health
- Admin demo: `admin@cardoctor.demo` / `Admin123!`

The local compose setup uses demo data and a development-only JWT fallback. Set a strong `JWT_SECRET` and custom demo credentials before exposing the app. Production startup requires `JWT_SECRET`; demo administrator seeding is disabled in production.

Docker Compose reads `MONGO_URI` from `backend/.env` when that file exists; otherwise the backend uses the Compose `mongo` service. Keep the database URI pointed at a dedicated development database while testing.

To run either app outside Docker, install dependencies in its directory and use its package scripts. When running the backend directly on your host, set `MONGO_URI` to your host-accessible MongoDB address (for example, `mongodb://127.0.0.1:27017/car-doctor`). The frontend can display bundled catalog data when the API is unavailable, but checkout requests are never treated as successful unless the API confirms them.

## Environment setup

Copy [`backend/.env.example`](./backend/.env.example) to `backend/.env` and set your database, JWT and optional OAuth provider values. Copy [`frontend/.env.example`](./frontend/.env.example) to `frontend/.env.local` if the backend URL differs from `http://localhost:5000`.

Google and Facebook OAuth callback URLs for local development:

- `http://localhost:5000/api/auth/google/callback`
- `http://localhost:5000/api/auth/facebook/callback`

## Main API routes

- `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- `GET /api/products`; admin-only product create/update/delete
- `GET /api/services`; admin-only service create/update/delete
- `GET /api/content/team` and `/api/content/testimonials`; admin-only content management
- `GET/POST/DELETE /api/cart`; authenticated cart operations
- `POST /api/orders`, `GET /api/orders`; admin-only status changes, removal and dashboard totals
