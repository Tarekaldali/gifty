/*
 * App.jsx – Main application file
 * --------------------------------
 * Sets up React Router and wraps everything in Auth + Cart providers.
 * All pages and their routes are defined here.
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Public pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Products from "./pages/Products";
import BoxBuilder from "./pages/BoxBuilder";
import ReadyBoxes from "./pages/ReadyBoxes";

// Customer pages
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderHistory from "./pages/OrderHistory";

// Admin pages
import Dashboard from "./pages/admin/Dashboard";
import ManageProducts from "./pages/admin/ManageProducts";
import ManageBoxes from "./pages/admin/ManageBoxes";
import ManageReadyBoxes from "./pages/admin/ManageReadyBoxes";
import ManageOrders from "./pages/admin/ManageOrders";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <main className="main">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/products" element={<Products />} />
              <Route path="/box-builder" element={<BoxBuilder />} />
              <Route path="/ready-boxes" element={<ReadyBoxes />} />

              {/* Customer routes (login required) */}
              <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />

              {/* Admin routes (admin only) */}
              <Route path="/admin" element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
              <Route path="/admin/products" element={<ProtectedRoute adminOnly><ManageProducts /></ProtectedRoute>} />
              <Route path="/admin/boxes" element={<ProtectedRoute adminOnly><ManageBoxes /></ProtectedRoute>} />
              <Route path="/admin/ready-boxes" element={<ProtectedRoute adminOnly><ManageReadyBoxes /></ProtectedRoute>} />
              <Route path="/admin/orders" element={<ProtectedRoute adminOnly><ManageOrders /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
