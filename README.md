# LUXE — Full-Stack E-Commerce Web Application

A complete, production-grade Full-Stack E-Commerce Platform built with **React, Tailwind CSS, Framer Motion, Node.js, Express, and Prisma ORM**.

---

## 🌟 Visual Design Philosophy

This project features **TWO completely distinct visual experiences**:

1. **Customer Experience**: Neo-Minimal + Glassmorphism + Editorial E-Commerce UI.
   - Large typography and generous negative space
   - Subtle glassmorphism (`backdrop-blur`) and refined gradients
   - Smooth micro-interactions & Framer Motion transitions
   - Floating pill navigation with interactive badges
   - Interactive zoom hover effects on product cards
   - Comprehensive multi-step checkout with real-time order tracking timeline
   - True dark mode support with localStorage persistence

2. **Admin Operations Suite**: Modern SaaS Analytics Dashboard.
   - High-density data grid & metric KPI cards with trend indicators
   - Recharts visual data visualization (Revenue over time, Inventory category distribution)
   - Real-time order logistics status tracking
   - In-line stock management & inventory monitoring
   - Customer account administration and role authorization (Admin ↔ Customer)

---

## 🚀 Key Features

### Customer Experience
- **Catalog Browsing & Search**: Search across names, categories, and brands with live debounced suggestions.
- **Multi-Faceted Filtering**: Filter by category, price range, and minimum star rating without full page reloads.
- **Product Details**: High-resolution gallery, real-time inventory counter, discount percentage, technical specifications, and related items.
- **Shopping Bag**: Server-backed cart with optimistic UI updates, inventory stock limits, subtotal, 18% GST calculation, and free shipping thresholds.
- **Simulated 3-Step Checkout**: Shipping address management, order review, and mock payment methods (Cash on Delivery, Credit/Debit Cards, UPI).
- **Interactive Order Tracking**: Visual milestone progress bar (`Order Placed` → `Confirmed` → `Processing` → `Shipped` → `Out for Delivery` → `Delivered`).
- **Profile & Security**: Update personal contact details, manage addresses, and change password securely.

### Admin Dashboard
- **KPI Metrics**: Real-time Gross Revenue, Total Orders, Customer Count, Active Catalog Items, Pending Shipments, and Low Stock Alerts.
- **Interactive Charts**: Responsive Area Chart for weekly revenue velocity and Donut Chart for category breakdown using Recharts.
- **Product Management (CRUD)**: Create, edit, preview, and delete products with image URL preview and JSON specification builder.
- **Real-Time Inventory**: Filter items by In Stock, Low Stock (≤10), and Out of Stock (0) with inline quick stock updates.
- **Order Logistics**: Update order status with immediate database persistence and customer timeline synchronisation.
- **Customer Administration**: View customer orders history, toggle active status, and grant/revoke administrative privileges.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion, Lucide Icons, Recharts, Axios, React Router v6 |
| **Backend** | Node.js (v20+ / v22), Express.js, JWT (jsonwebtoken), bcryptjs, CORS, Dotenv |
| **Database & ORM** | Prisma ORM, SQLite (Zero-config out of the box) / MySQL compatible |
| **Tooling** | npm, PostCSS, Autoprefixer, ESLint |

---

## 📁 Application Structure

```
ecommerce-app/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/        # ProtectedRoute, Modal, Loader, Pagination, SkeletonCard, EmptyState
│   │   │   ├── customer/      # Navbar, Footer, ProductCard, FilterPanel, OrderTimeline, CustomerLayout
│   │   │   └── admin/         # AdminLayout, AdminSidebar, AdminHeader, StatCard
│   │   ├── context/           # AuthContext, CartContext, ThemeContext, ToastContext
│   │   ├── pages/
│   │   │   ├── customer/      # HomePage, ShopPage, ProductDetailPage, CartPage, CheckoutPage, OrdersPage, OrderDetailPage, ProfilePage, LoginPage, RegisterPage
│   │   │   └── admin/         # AdminDashboard, AdminProducts, AdminProductNew, AdminProductEdit, AdminInventory, AdminOrders, AdminUsers
│   │   ├── services/          # Axios instance & domain API services
│   │   ├── utils/             # Formatters (currency, dates, statuses)
│   │   ├── App.jsx            # Routing hierarchy
│   │   ├── index.css          # Tailwind CSS layer styles & glassmorphism
│   │   └── main.jsx           # Entry point
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/            # Prisma client singleton
│   │   ├── controllers/       # Auth, Product, Cart, Order, Admin controllers
│   │   ├── middleware/        # JWT Auth, Role-based Admin check, Global Error Handler
│   │   ├── routes/            # REST API endpoints
│   │   └── server.js          # Express server entry point
│   ├── prisma/
│   │   ├── schema.prisma      # Relational database schema
│   │   ├── seed.js            # Comprehensive seed data (1 admin, 5 users, 33 products)
│   │   └── dev.db             # Local SQLite database
│   ├── .env
│   └── package.json
│
├── package.json               # Root scripts for running client & server
├── .env.example
├── .gitignore
└── README.md
```

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Administrator** | `admin@example.com` | `Admin@123` | Full access to `/admin/*` and customer storefront |
| **Customer** | `user@example.com` | `User@123` | Storefront browsing, cart, checkout, order tracking |

*(Note: The login page includes 1-click quick fill buttons for instant testing of both accounts)*

---

## ⚡ Getting Started

### Prerequisites
- Node.js (v18 or newer)
- npm (v9 or newer)

### 1. Installation
Clone the repository and install dependencies in both client and server:

```bash
# In the project root directory
cd server && npm install
cd ../client && npm install
```

### 2. Database Initialization
Generate the Prisma client, create tables, and populate seed data:

```bash
cd server
npx prisma generate
npx prisma db push
node prisma/seed.js
```

### 3. Run the Development Servers

**Run Backend (Port 5000):**
```bash
cd server
npm run dev
# Running at http://localhost:5000
```

**Run Frontend (Port 5173):**
```bash
cd client
npm run dev
# Running at http://localhost:5173
```

---

## 🌐 REST API Documentation

### Authentication (`/api/auth`)
| Method | Route | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new customer account | No |
| `POST` | `/api/auth/login` | Authenticate & retrieve JWT | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes |
| `PUT` | `/api/auth/profile` | Update user contact info & address | Yes |
| `PUT` | `/api/auth/change-password` | Update user password | Yes |

### Products (`/api/products`)
| Method | Route | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/products` | Query products (search, filter, sort, pagination) | No |
| `GET` | `/api/products/categories`| List all categories with product counts | No |
| `GET` | `/api/products/:id` | Get product details & related products | No |
| `POST` | `/api/products` | Create product | Yes (Admin) |
| `PUT` | `/api/products/:id` | Update product info | Yes (Admin) |
| `DELETE` | `/api/products/:id` | Soft delete product | Yes (Admin) |

### Shopping Bag (`/api/cart`)
| Method | Route | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/cart` | Get current user's cart | Yes |
| `POST` | `/api/cart` | Add product to cart (upserts quantity) | Yes |
| `PUT` | `/api/cart/:itemId` | Update quantity | Yes |
| `DELETE` | `/api/cart/:itemId` | Remove item from cart | Yes |
| `DELETE` | `/api/cart/clear` | Empty cart | Yes |

### Orders (`/api/orders`)
| Method | Route | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/orders` | Place order (deducts stock in atomic transaction) | Yes |
| `GET` | `/api/orders` | List user's order history | Yes |
| `GET` | `/api/orders/:id` | Get order tracking details & items | Yes |

### Admin Operations (`/api/admin`)
| Method | Route | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/admin/stats` | Dashboard KPIs & chart metrics | Yes (Admin) |
| `GET` | `/api/admin/orders` | View all customer orders with filters | Yes (Admin) |
| `PUT` | `/api/admin/orders/:id/status` | Update logistics status (`SHIPPED`, etc.) | Yes (Admin) |
| `GET` | `/api/admin/inventory` | Inventory stock audit | Yes (Admin) |
| `PUT` | `/api/admin/inventory/:id` | Modify available stock units | Yes (Admin) |
| `GET` | `/api/admin/users` | List registered user directory | Yes (Admin) |
| `PUT` | `/api/admin/users/:id` | Change user role or active state | Yes (Admin) |

---

## 🛡️ Security & Role-Based Routing

1. **Authentication Token**: JSON Web Tokens (JWT) signed with 7-day expiry and validated in all protected controllers.
2. **Password Hashing**: Stored with 12 salt rounds using `bcryptjs`.
3. **Admin Route Protection**: Unauthenticated users attempting to access `/admin/*` are redirected to `/login`, while standard customers are denied access and redirected to `/shop`.
4. **Calculations Verified Server-Side**: Cart subtotals, GST taxes, and shipping rates are strictly computed on the backend server to prevent client-side tampering.

---

## 📜 License
MIT License. Created for high-quality production demonstrations, portfolio showcases, and full-stack engineering evaluations.
