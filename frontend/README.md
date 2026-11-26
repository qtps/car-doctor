# Car Doctor storefront

Responsive Next.js storefront for the Car Doctor service center. The image files in `public/` are kept separately from the page components so they can be replaced without editing the UI.

## Run locally

From the repository root, start the MongoDB-backed API and Next.js app:

```bash
docker compose up --build
```

The storefront is at [http://localhost:3000](http://localhost:3000); the API is at [http://localhost:5000/api](http://localhost:5000/api). For frontend-only work, install the frontend dependencies and run `npm run dev` from this folder. Set `NEXT_PUBLIC_API_URL` to the backend origin in `.env.local` if it is not running on port 5000. If the API is offline, the storefront uses bundled demo catalog data and keeps the cart in browser storage.

## Demo administrator

In the local Docker Compose development environment, the backend seeds a demo administrator:

- Email: `admin@cardoctor.demo`
- Password: `Admin123!`

Change these through `DEMO_ADMIN_EMAIL` and `DEMO_ADMIN_PASSWORD` in `backend/.env` before sharing the demo. Demo administrator seeding is disabled when `NODE_ENV=production`. The browser-only preview login can open the demo dashboard when the API is offline, but those local changes are not persisted to MongoDB.

## Social sign-in

Email/password registration and login work through the API. Google and Facebook OAuth are implemented but need credentials configured in `backend/.env`; see `backend/.env.example`. Set each provider's callback URL to:

- Google: `http://localhost:5000/api/auth/google/callback`
- Facebook: `http://localhost:5000/api/auth/facebook/callback`

The backend returns the browser to `/auth/callback` after successful authentication and stores the JWT in an HTTP-only cookie.

## Admin workspace

The administrator dashboard manages orders and statuses, product inventory, services, team profiles and customer reviews. Public catalog/content reads are served by NestJS and are seeded with sample records when their MongoDB collections are empty.
