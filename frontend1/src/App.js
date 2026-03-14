import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

// Context providers
import { AuthProvider }    from './context/AuthContext';
import { CartProvider }    from './context/CartContext';

// Layout
import Navbar      from './components/layout/Navbar';
import Footer      from './components/layout/Footer';
import CartSidebar from './components/cart/CartSidebar';

// Route guards
import { ProtectedRoute, AdminRoute, GuestRoute } from './components/common/ProtectedRoute';

// Pages
import Home           from './pages/Home';
import ProductList    from './pages/ProductList';
import ProductDetail  from './pages/ProductDetail';
import CartPage       from './pages/CartPage';
import AuthPage       from './pages/AuthPage';
import { OrdersPage, OrderDetailPage } from './pages/OrdersPage';
import AdminDashboard from './pages/AdminDashboard';

/* Layout wrapper — Navbar + page content + Footer + Cart Sidebar */
const Layout = ({ children, hideFooter }) => (
  <>
    <Navbar />
    <CartSidebar />
    <main>{children}</main>
    {!hideFooter && <Footer />}
  </>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/collections" element={<Layout><ProductList /></Layout>} />
          <Route path="/product/:id"  element={<Layout><ProductDetail /></Layout>} />

          {/* Guest only (redirect to home if logged in) */}
          <Route path="/login"  element={<GuestRoute><Layout><AuthPage /></Layout></GuestRoute>} />
          <Route path="/signup" element={<GuestRoute><Layout><AuthPage /></Layout></GuestRoute>} />

          {/* Protected (login required) */}
          <Route path="/cart" element={<ProtectedRoute><Layout><CartPage /></Layout></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Layout><OrdersPage /></Layout></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute><Layout><OrderDetailPage /></Layout></ProtectedRoute>} />

          {/* Admin only */}
          <Route path="/admin" element={<AdminRoute><Layout hideFooter><AdminDashboard /></Layout></AdminRoute>} />

          {/* 404 */}
          <Route path="*" element={
            <Layout>
              <div style={{ textAlign: 'center', padding: '120px 20px' }}>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 48, fontWeight: 400, marginBottom: 16 }}>404</h1>
                <p style={{ color: 'var(--gray-600)', marginBottom: 32 }}>Page not found</p>
                <a href="/" className="btn-primary">Go Home</a>
              </div>
            </Layout>
          } />
        </Routes>

        {/* Toast notifications */}
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar
          closeButton={false}
          toastStyle={{
            fontFamily: 'var(--font-sans)',
            fontSize: '13px',
            borderRadius: '2px',
            border: '1px solid var(--gray-200)'
          }}
        />
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
