export type Product = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  rating: number;
  featured: boolean;
};

export type Service = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  active?: boolean;
};

export type TeamMember = {
  _id: string;
  name: string;
  role: string;
  image: string;
};

export type Testimonial = {
  _id: string;
  name: string;
  role: string;
  quote: string;
  image: string;
  rating: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  provider?: string;
  emailVerified?: boolean;
};

export type CartLine = { productId: string; quantity: number };

export type Order = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  items: Array<{ name: string; image: string; quantity: number; price: number }>;
  total: number;
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  createdAt: string;
};

export const demoProducts: Product[] = [
  { _id: 'demo-product-1', name: 'Car Engine Plug', slug: 'car-engine-plug', description: 'Precision-engineered spark plugs for reliable ignition and a smoother drive.', price: 20, image: '/product_1.png', category: 'Engine', stock: 24, rating: 5, featured: true },
  { _id: 'demo-product-2', name: 'Car Air Filter', slug: 'car-air-filter', description: 'High-efficiency air filter that helps protect your engine and restore performance.', price: 20, image: '/product_2.png', category: 'Filters', stock: 18, rating: 5, featured: true },
  { _id: 'demo-product-3', name: 'Cools LED Light', slug: 'cools-led-light', description: 'Bright, durable automotive lighting built for a clear view on every road.', price: 20, image: '/product_3.png', category: 'Lighting', stock: 15, rating: 5, featured: true },
  { _id: 'demo-product-4', name: 'Performance Brake Kit', slug: 'performance-brake-kit', description: 'Responsive, dependable braking components inspected by our technicians.', price: 35, image: '/product_4.png', category: 'Brakes', stock: 12, rating: 5, featured: true },
  { _id: 'demo-product-5', name: 'All-season Tire Set', slug: 'all-season-tire-set', description: 'Road-ready tires selected for dependable grip and everyday comfort.', price: 80, image: '/product_5.png', category: 'Tires', stock: 9, rating: 5, featured: true },
  { _id: 'demo-product-6', name: 'Car Battery', slug: 'car-battery', description: 'Reliable starting power tested to meet your vehicle specifications.', price: 65, image: '/product_6.png', category: 'Electrical', stock: 11, rating: 5, featured: true },
];

export const demoServices: Service[] = [
  { _id: 'demo-service-1', name: 'Electrical System', slug: 'electrical-system', description: 'Battery, starter, alternator and wiring diagnostics with clear repair recommendations.', price: 20, image: '/cart_items_1.png', active: true },
  { _id: 'demo-service-2', name: 'Engine Diagnostics', slug: 'engine-diagnostics', description: 'Accurate engine scans and expert troubleshooting to get you back on the road.', price: 20, image: '/cart_items_2.png', active: true },
  { _id: 'demo-service-3', name: 'Auto Car Repair', slug: 'auto-car-repair', description: 'Reliable repairs carried out by experienced, certified automotive technicians.', price: 20, image: '/cart_items_3.png', active: true },
  { _id: 'demo-service-4', name: 'Brake & Suspension', slug: 'brake-suspension', description: 'Keep your ride safe and steady with brake, steering and suspension care.', price: 35, image: '/cart_items_4.png', active: true },
  { _id: 'demo-service-5', name: 'Engine Oil Change', slug: 'engine-oil-change', description: 'Fresh oil and quality filters to support a healthy, longer-lasting engine.', price: 25, image: '/cart_items_5.png', active: true },
  { _id: 'demo-service-6', name: 'Battery Service', slug: 'battery-service', description: 'Battery testing, replacement and charging system checks for peace of mind.', price: 30, image: '/cart_items_6.png', active: true },
];

export const demoTeam: TeamMember[] = [
  { _id: 'demo-team-1', name: 'Alex Morgan', role: 'Engine Expert', image: '/team_member_1.png' },
  { _id: 'demo-team-2', name: 'Jordan Lee', role: 'Service Technician', image: '/team_member_2.png' },
  { _id: 'demo-team-3', name: 'Sam Rivera', role: 'Automotive Specialist', image: '/team_member_3.png' },
];

export const demoTestimonials: Testimonial[] = [
  { _id: 'demo-review-1', name: 'Awlad Hossain', role: 'Businessman', quote: 'The team explained everything clearly, finished on time, and my car has never driven better. I will be back for every service.', image: '/awlad.png', rating: 5 },
  { _id: 'demo-review-2', name: 'Monir Ahmed', role: 'Local customer', quote: 'Friendly service, fair pricing and no surprises. Booking was easy and the technicians did a fantastic job.', image: '/monir.png', rating: 5 },
];

export const demoOrders: Order[] = [
  { _id: 'demo-order-1', firstName: 'Taylor', lastName: 'Morgan', email: 'taylor@example.com', phone: '+1 555 013 2200', items: [{ name: 'Engine Diagnostics', image: '/cart_items_2.png', quantity: 1, price: 20 }], total: 20, status: 'pending', createdAt: '2026-03-17T09:00:00.000Z' },
  { _id: 'demo-order-2', firstName: 'Jamie', lastName: 'Parker', email: 'jamie@example.com', phone: '+1 555 015 8750', items: [{ name: 'Car Air Filter', image: '/product_2.png', quantity: 2, price: 20 }], total: 40, status: 'approved', createdAt: '2026-03-16T09:00:00.000Z' },
];
