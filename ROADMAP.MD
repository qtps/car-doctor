# Car Doctor — Full-Stack Roadmap (Next.js + NestJS)

## 1. Screen Flow Summary

- **Landing Page (Screens 1–4):** Hero & About, Service Area & Contact Bar, Browse Products & Team, Why Choose Us, Testimonials & Footer[cite: 1, 2, 3, 4]
- **Service Details (Screens 5–6):** Dynamic service info, sidebar service switcher, 3 steps, video/brochure blocks, `Proceed Checkout`[cite: 5, 6]
- **Check Out (Screen 7):** Customer details form (`First Name`, `Last Name`, `Your Phone`, `Your Email`, `Your Message`) & `Order Confirm`[cite: 7]
- **Cart Details (Screen 11):** Cart/order item list, remove item (`x`), `Clear Shopping Cart`, `Continue Shopping`[cite: 11]
- **Auth (Screens 8–9):** Sign Up (`/signup`) & Login (`/login`) with email/password and social options[cite: 8, 9]
- **Manage All Orders (Screen 12):** Order list, customer email, date, status dropdown (`Approved` / `Pending`), remove order (`x`)[cite: 12]
- **404 Page (Screen 10):** Fallback route with navigation back to active screens[cite: 10]

## 2. Step-by-Step Build Order

- [ ] **Step 1:** Next.js + NestJS + PostgreSQL (Prisma) setup, shared Navbar/Footer, and `404` page
- [ ] **Step 2:** Database schema (`User`, `Service`, `Product`, `CartItem`, `Order`, `TeamMember`, `Testimonial`) & seed data
- [ ] **Step 3:** Landing page sections connected to NestJS `GET` endpoints
- [ ] **Step 4:** Service details page (`/services/[slug]`) & checkout flow (`/checkout` -> `POST /orders`)
- [ ] **Step 5:** Cart details screen (`GET`, `DELETE` item, `Clear Shopping Cart`, `Continue Shopping`)
- [ ] **Step 6:** Authentication (`/signup`, `/login`, JWT/cookies, NestJS Auth & Role Guards)
- [ ] **Step 7:** `Manage All Orders` (`PATCH /orders/:id/status`, `DELETE /orders/:id`) & `Manage Inventory` CRUD

## 3. Core NestJS API Endpoints

- **Auth:** `POST /auth/signup`, `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`
- **Catalog & Content:** `GET /services`, `GET /services/:slug`, `GET /products`, `GET /products/:id`, `GET /team`, `GET /testimonials`
- **Cart & Orders:** `GET /cart`, `POST /cart`, `DELETE /cart/:itemId`, `DELETE /cart`, `POST /orders`, `GET /orders`, `PATCH /orders/:id/status`, `DELETE /orders/:id`
- **Inventory:** `POST /products`, `PATCH /products/:id`, `DELETE /products/:id`

