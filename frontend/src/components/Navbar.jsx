/*
 * Navbar Component
 * ----------------
 * Professional top navigation bar with mobile hamburger menu.
 */

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? "nav-link active" : "nav-link";

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={() => setMenuOpen(false)}>
          <span className="logo-icon">🎁</span>
          <span className="logo-text">Gifty</span>
        </Link>

        <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span className={`hamburger-line ${menuOpen ? "open" : ""}`}></span>
          <span className={`hamburger-line ${menuOpen ? "open" : ""}`}></span>
          <span className={`hamburger-line ${menuOpen ? "open" : ""}`}></span>
        </button>

        <div className={`nav-links ${menuOpen ? "nav-open" : ""}`}>
          <div className="nav-main">
            <Link to="/" className={isActive("/")} onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/products" className={isActive("/products")} onClick={() => setMenuOpen(false)}>Shop</Link>
            <Link to="/box-builder" className={isActive("/box-builder")} onClick={() => setMenuOpen(false)}>Build a Box</Link>
            <Link to="/ready-boxes" className={isActive("/ready-boxes")} onClick={() => setMenuOpen(false)}>Ready Gifts</Link>
          </div>

          <div className="nav-actions">
            <Link to="/cart" className={`nav-link nav-cart-link ${location.pathname === "/cart" ? "active" : ""}`} onClick={() => setMenuOpen(false)}>
              🛒 Cart
              {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </Link>

            {user ? (
              <>
                <Link to="/orders" className={isActive("/orders")} onClick={() => setMenuOpen(false)}>My Orders</Link>
                {user.role === "admin" && (
                  <Link to="/admin" className={`nav-link nav-admin-link ${location.pathname.startsWith("/admin") ? "active" : ""}`} onClick={() => setMenuOpen(false)}>
                    Admin Panel
                  </Link>
                )}
                <div className="nav-user-group">
                  <span className="nav-user">{user.name}</span>
                  <button onClick={() => { logout(); setMenuOpen(false); }} className="nav-btn">Logout</button>
                </div>
              </>
            ) : (
              <div className="nav-auth-group">
                <Link to="/login" className="nav-btn nav-btn-outline" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="nav-btn nav-btn-fill" onClick={() => setMenuOpen(false)}>Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
