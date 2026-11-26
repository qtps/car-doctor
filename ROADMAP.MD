# Car Doctor project status

The original design references are implemented as a responsive storefront and an administrator workspace. The current stack is Next.js, NestJS, MongoDB and Mongoose.

## Storefront

- Landing page with hero, about, services, catalog, team, customer reviews, benefits, contact and editorial sections.
- Service and product detail routes with booking/cart actions.
- Browser-persisted cart, quantity controls, guest checkout and customer order history.
- Email/password sign-up and login, HTTP-only cookie sessions, Google/Facebook OAuth integration points, and a 404 page.
- Individual image/logo assets remain under `frontend/public/`.

## Backend and administration

- MongoDB-backed users, products, services, cart items, orders, team profiles and testimonials.
- Demo catalog/content seed data and a development-only seeded administrator.
- Role-protected administrator operations for order status/deletion, product/service inventory and team/review content.
- API validation, CORS, health endpoint and JWT cookie/bearer authentication.

## Local setup

Run `docker compose up --build` from the repository root. See [`README.md`](./README.md) for the demo login and environment configuration. Google/Facebook OAuth remains inactive until provider credentials and matching local callback URLs are configured in `backend/.env`.
