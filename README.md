# 🍵 Tea E-Commerce Platform

A full-stack premium tea e-commerce platform built with React.js and Node.js/Express, featuring a complete shopping experience with admin dashboard.

---

## 🖥️ Tech Stack

**Frontend**
- React.js
- React Router DOM v6
- Axios
- React Toastify
- CSS3 (Custom Properties, Grid, Flexbox)
- Google Fonts (Montserrat, Prosto One, Cormorant Garamond)

**Backend**
- Node.js + Express.js
- MongoDB Atlas + Mongoose
- JWT Authentication
- Bcrypt.js
- Nodemon

---

## ✨ Features

### Customer
- Browse tea collections with filters (category, origin, flavor, caffeine, organic)
- Product detail page with variants, steeping instructions
- Cart management (add, update, remove items)
- 3-step checkout (Bag → Delivery → Review & Payment)
- Order history and order tracking

### Admin / Superadmin
- Dashboard with revenue, orders, users, products stats
- Add, edit, deactivate products
- Manage orders and update order status
- View and block/unblock users

---

## 🗂️ Project Structure

```
tea-ecommerce/
├── tea-backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   └── admin.js
│   ├── server.js
│   ├── seed.js
│   └── package.json
│
└── tea-frontend/
    ├── public/
    │   └── assets/
    │       └── img/
    ├── src/
    │   ├── api/
    │   │   └── index.js
    │   ├── components/
    │   │   ├── cart/
    │   │   │   └── CartSidebar.jsx
    │   │   ├── common/
    │   │   │   └── ProtectedRoute.jsx
    │   │   └── layout/
    │   │       ├── Navbar.jsx
    │   │       └── Footer.jsx
    │   ├── context/
    │   │   ├── AuthContext.js
    │   │   └── CartContext.js
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── ProductList.jsx
    │   │   ├── ProductDetail.jsx
    │   │   ├── CartPage.jsx
    │   │   ├── AuthPage.jsx
    │   │   ├── OrdersPage.jsx
    │   │   └── AdminDashboard.jsx
    │   ├── App.js
    │   └── index.css
    └── package.json
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js v16+
- MongoDB Atlas account
- Git

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/tea-ecommerce.git
cd tea-ecommerce
```

### 2. Backend Setup

```bash
cd tea-backend
npm install
```

Create `.env` file in `tea-backend/`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/tea-ecommerce?retryWrites=true&w=majority
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

Seed the database:

```bash
node seed.js
```

Start the server:

```bash
npm run dev
```

Backend runs on: `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd tea-frontend
npm install
```

Create `.env` file in `tea-frontend/`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the app:

```bash
npm start
```

Frontend runs on: `http://localhost:3000`

---

## 🔑 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Superadmin | superadmin@tea.com | superadmin123 |
| Admin | admin@tea.com | admin123 |
| User | user@tea.com | user123 |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products (with filters) |
| GET | `/api/products/featured` | Get featured products |
| GET | `/api/products/:id` | Get single product |
| GET | `/api/products/:id/related` | Get related products |
| POST | `/api/products` | Create product (admin) |
| PUT | `/api/products/:id` | Update product (admin) |
| DELETE | `/api/products/:id` | Delete product (superadmin) |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get user cart |
| POST | `/api/cart/add` | Add item to cart |
| PUT | `/api/cart/update` | Update cart item |
| DELETE | `/api/cart/remove/:id` | Remove cart item |
| DELETE | `/api/cart/clear` | Clear cart |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders/place` | Place order |
| GET | `/api/orders/my-orders` | Get user orders |
| GET | `/api/orders/:id` | Get single order |
| GET | `/api/orders` | Get all orders (admin) |
| PUT | `/api/orders/:id/status` | Update order status (admin) |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Get dashboard stats |
| GET | `/api/admin/users` | Get all users |
| PUT | `/api/admin/users/:id/block` | Block/unblock user |
| PUT | `/api/admin/users/:id/role` | Change user role (superadmin) |

---

## 🌐 Deployment (Railway)

### Backend
1. Push code to GitHub
2. Go to [railway.app](https://railway.app)
3. New Project → Deploy from GitHub → select `tea-backend`
4. Add environment variables (same as `.env`)
5. Note the deployed URL

### Frontend
1. Update `REACT_APP_API_URL` to Railway backend URL
2. New Project → Deploy from GitHub → select `tea-frontend`
3. Build Command: `npm run build`
4. Start Command: `npx serve -s build`

---

## 👥 Roles & Permissions

| Permission | User | Admin | Superadmin |
|------------|------|-------|------------|
| Browse & shop | ✅ | ✅ | ✅ |
| Manage products | ❌ | ✅ | ✅ |
| Manage orders | ❌ | ✅ | ✅ |
| Block users | ❌ | ✅ | ✅ |
| Delete products | ❌ | ❌ | ✅ |
| Change user roles | ❌ | ❌ | ✅ |

---

## 📸 Pages

- **Home** — Hero section, trust badges, collections grid
- **Collections** — Filters sidebar, product grid, pagination
- **Product Detail** — Variants, steeping instructions, related products
- **Cart** — 3-step checkout flow
- **Orders** — Order history and tracking
- **Admin Dashboard** — Stats, products, orders, users management

---

## 🛠️ Built By

DevSquad_26 — Hackathon Project