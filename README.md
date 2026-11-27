# Car Doctor

A frontend-only car-service storefront built with Next.js. The backend has been
removed for now and can be set up separately later.

## Run locally

Requirements: Node.js and npm.

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000. The storefront uses bundled demo catalog data and
browser storage where available. API-dependent actions will not persist until
a backend is added.

To run with Docker Compose instead:

```bash
docker compose up --build
```

The frontend is available at http://localhost:3000.
