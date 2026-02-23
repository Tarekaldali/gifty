import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    API.get("/products")
      .then((res) => setFeatured(res.data.slice(0, 6))) // show first 6
      .catch(() => {});
  }, []);

  return (
    <div className="page home-page">
      {/* ── Hero Section ─────────────────────────────── */}
      <section className="hero">
        <div className="hero-badge">✨ Premium Gift Experience</div>
        <h1>The Perfect Gift,<br /><span>Beautifully Boxed</span></h1>
        <p>Discover curated gifts for every occasion — graduation, wedding, birthday & more. Each one wrapped with love.</p>
        <div className="hero-actions">
          <Link to="/products" className="btn btn-primary btn-lg">
            Start Shopping →
          </Link>
          <Link to="/register" className="btn btn-secondary btn-lg">
            Create Account
          </Link>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <strong>500+</strong>
            <span>Unique Gifts</span>
          </div>
          <div className="hero-stat">
            <strong>50k+</strong>
            <span>Happy Customers</span>
          </div>
          <div className="hero-stat">
            <strong>4.9★</strong>
            <span>User Rating</span>
          </div>
        </div>
      </section>

      {/* ── Features Strip ───────────────────────────── */}
      <div className="features-strip">
        <div className="feature-item">
          <div className="feature-icon pink">🎁</div>
          <div className="feature-text">
            <h4>Custom Gift Boxes</h4>
            <p>Build your own 3D gift box</p>
          </div>
        </div>
        <div className="feature-item">
          <div className="feature-icon blue">🚚</div>
          <div className="feature-text">
            <h4>Fast Delivery</h4>
            <p>Delivered to your doorstep</p>
          </div>
        </div>
        <div className="feature-item">
          <div className="feature-icon green">🔒</div>
          <div className="feature-text">
            <h4>Secure Checkout</h4>
            <p>Safe & trusted payments</p>
          </div>
        </div>
        <div className="feature-item">
          <div className="feature-icon gold">⭐</div>
          <div className="feature-text">
            <h4>Top Quality</h4>
            <p>Premium hand-picked items</p>
          </div>
        </div>
      </div>

      {/* ── Featured Products ────────────────────────── */}
      <section className="section">
        <h2>Featured Gifts</h2>
        <div className="product-grid">
          {featured.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
        {featured.length === 0 && (
          <p className="muted">No products yet. An admin can add them from the dashboard!</p>
        )}
      </section>
    </div>
  );
}
